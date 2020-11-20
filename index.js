const http = require('http')
const qs = require('qs')
const handleRouter = require('./router/index')

// 1. 处理从客户端发送过来的数据
const handleRequest = (req) => {
    return new Promise((resolve, reject) => {
        let post_data = ''
        req.on('data', chunk => {
            post_data += chunk
        })
        req.on('end', () => {
            resolve(post_data)
        })
    })
}

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'})
    handleRequest(req).then(data => {
        // console.log('客户端发送过来的数据', data)
        req.body = data
        let result_data = handleRouter(req, res) // 2. 处理从mysql返回的数据
        if (result_data) {
            result_data.then(data => {
                res.end(JSON.stringify(data)) // 3. 向客户端发送结果
            })
        } else {
            res.writeHead(404, { 'Content-Type': 'text/html' })
            res.end('404 not found')
        }
    })
})

server.listen(3000, () => {
    console.log('监听3000端口')
})