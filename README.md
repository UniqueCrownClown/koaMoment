# Vue+Koa+Mongodb练习

> 作者： clown
>
>
> 功能： 基于vue koa mongodb进行登录,注册,留言,点赞的简单网站。
>
>
> github: [https://github.com/UniqueCrownClown/koaMoment](https://github.com/UniqueCrownClown/koaMoment)

### 基本问题记录

1. vue全家桶的使用
2. koa与mongoose的基本使用
3. jsonwebtoken的使用以及前后台鉴定登录
4. log4js的配置和使用
5. koa-body中间件实现formdata数据上传
6. koa-static中间件实现静态资源(图片)的展现

### 运行方法说明
1. 启动mongo
2. 分别启动koaServer和koaClient工程
3. log的路径在koaServer工程的根目录下
4. 客户端图片文件记载在koaServer的public目录下

``` bash
$ npm install
$ npm start 
```