---
title: "Nodejs相关"
date: 2021-06-12T19:21:20+08:00
draft: true
tags:
 - 
---

### Node.js处理get

```js
const http = require('http')
const queryString = require('querystring')

const server = http.createServer( (req, res) => {
    console.log(req.method) // GET
    const url = req.url  // 获取请求的完整URL
    console.log(url)
    req.query = queryString.parse(url.split('?')[1]) // 解析queryString
    console.log('query: ', req.query)
    res.end(JSON.stringify(req.query)); // 将queryString返回
})

server.listen(8000, () => {
    console.log('server is running on port 8000')
})
```