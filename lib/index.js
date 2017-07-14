#!/usr/bin/env node

const program=require('commander')
const util=require('./util')

// dbsearch
program
  .version('0.0.4')
  .command('nowplay')
  .description('获取正在上映的电影')
  .action(()=>{
    util.getNowPlaying()
      .then(res=>{
        console.log(res)
      })
      .catch(err=>{
        console.log('^~^获取失败^~^')
      })
  })

program
  .command('top10')
  .description('获取上映中票房前十的电影信息')
  .option('-t,--type [str]','票房类型【豆瓣，全国，北美】','豆瓣')
  .action((options)=>{
    util.getTop10()
      .then(res=>{
        res.forEach(item=>{
          if(item.type==options.type){
            console.log(item.movies)
          }
        })
      })
      .catch(err=>{
        console.log('^~^获取失败^~^')
      })
  })

program.parse(process.argv)

module.exports=program