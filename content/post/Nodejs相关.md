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
const querystring = require('querystring')

const server = http.createServer( (req, res) => {
    console.log(req.method) // GET
    const url = req.url  // 获取请求的完整URL
    console.log(url)
    req.query = querystring.parse(url.split('?')[1]) // 解析queryString
    console.log('query: ', req.query)
    res.end(JSON.stringify(req.query)); // 将queryString返回
})

server.listen(8000, () => {
    console.log('server is running on port 8000')
})
```

### Nodejs处理post
```js
// new 
const http = require('http')
const server = http.createServer ((req, res) => {
        if(req.method === 'POST') {
            // 数据格式
            console.log(req.method)
            console.log('content-type', req.headers['content-type'])
            // 接收数据
            let postData = ''
            req.on('data', chunk => {
                // postData += chunk.toString()
                postData += chunk
            })
            req.on('end', () => {
                console.log('postData: ', postData)
                res.end('hello world!!!') // 在这里返回, 因为是异步
            })
        }
})

server.listen(3000, () => {
    console.log('server is running on port 3000')
})

// Node.js处理路由
// const server = http.createServer((req, res) => {
//     const url = req.url
//     const path = url.split('?')[0]
//     res.end(path) // 返回路由
// })
```

### Node.js综合

```js
const http = require('http')
const querystring = require('querystring')

const server = http.createServer((req, res) => {
    const method = req.method
    const url = req.url
    const path = url.split('?')[0] // 路由  ['/']
    const query = querystring.parse(url.split('?')[1]) // 如果没有undefined

    // 设置返回格式为JSON
    res.setHeader('Content-type', 'application/json')

    // 返回的数据
    const resData = {
        method,
        url,
        path,
        query
    }

    // 返回
    if (method === 'GET') {
        res.end(JSON.stringify(resData))
    }

    if (method === 'POST') {
        let postData = ''
        req.on('data', chunk => {
            postData += chunk
        })
        req.on('end', () => {
            resData.postData = postData
            // 返回
            res.end(JSON.stringify(resData))
        })
    }
})

server.listen(3000, () => {
    console.log('server is running on port 3000')
})
```