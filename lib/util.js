const request=require('superagent')
const cheerio=require('cheerio')

/*
* 正在上映
* 票房排行
* 即将上映
* 电影排行（热度）
*/

async function getSource(url){
  let res=await request.get(url)
  return res.text
}
// 正在上映
async function getNowPlaying(){
  let $=cheerio.load(await getSource('https://movie.douban.com/cinema/nowplaying/shanghai/'),{
    decodeEntities:false
  })
  let results=[]
  $(".list-item",'#nowplaying').each((i,item)=>{    
    let title=$(item).data('title') // 标题
    let poster=$(item).find('.poster img').attr('src') // 海报
    let score=$(item).data('score') // 评分
    let release=$(item).data('release') // 年份
    let region=$(item).data('region') // 地区
    let actors=$(item).data('actors') // 演员
    let director=$(item).data('director') // 导演
    let duration=$(item).data('duration') // 时长
    results.push({
      title,
      poster,
      score,
      release,
      region,
      actors,
      director,
      duration
    })
  })
  return results
}
// 票房排行
async function getTop10(){
  let $=cheerio.load(await getSource('https://movie.douban.com/cinema/nowplaying/shanghai/'),{
    decodeEntities:false
  })
  let results=[]
  let $ranks=$('.view_1','.tab_view')
  $('li','.tab_nav').each((i,item)=>{
    let type=$(item).text()
    let date=$(item).data('date')
    let movies=[]
    $ranks.eq(i).find('li').each((j,m)=>{
      let title=$(m).find('.movie_ranking_tille a').text()
      let score=$(m).find('.subject-rate').text()
      movies.push({
        title,
        score
      })
    })
    results.push({
      type,
      date,
      movies
    })
  })
  return results
}
// 获取所有分类
async function getTags(type){
  let results=await getSource(`https://movie.douban.com/j/search_tags?type=${type}&source=`)
  return JSON.parse(results).tags
}
// 根据条件搜索结果
async function getResults(type,tag,sort,limit=20,start=0){
  return JSON.parse(await getSource(`https://movie.douban.com/j/search_subjects?type=${type}&tag=${encodeURIComponent(tag)}sort=${sort}&page_limit=${limit}&page_start=${start}`))
}

module.exports={
  getNowPlaying,
  getTop10,
  getTags,
  getResults
}