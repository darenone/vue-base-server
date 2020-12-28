# 介绍

本项目是基于nodeJs平台，然后利用js开发的后端项目，在这个项目里，我演示了如何利用js连接mysql，并生成前端项目可用的接口，实现对mysql进行增删改查的工作

如何在nodeJs上利用js开发一套可供前端调用的后端项目，流程如下：

## 1. 如何启动本项目

```
git clone https://github.com/darenone/vue-base-server.git // 克隆项目

cd vue-base-server // 进入项目根目录

npm/cnpm install // 安装项目依赖

npm run serve // 启动本项目

```

**备注**： 本项目涉及到操作mysql，请先在你的电脑上安装mysql和Navicat，如果你不知道如何运行此项目，也请联系我：13917278119（微信同号）一起交流进步

## 2. 首先创建你的后端项目

这里我的后端项目命名为`vue-base-server`,在此文件夹下新建`index.js`文件，启动一个后端服务器：http://localhost:3000

`index.js`
```js
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
```

## 3. 创建router/index.js文件，用以向前端输出接口

`router/index.js`
```js
const url = require('url')
const { get_user_list,  add_user, get_user_byId, upDate_user, delete_user} = require('./../controller/user')

function handleRouter(req, res) {
    let url_obj = url.parse(req.url, true) // 获取请求的地址
    if (url_obj.pathname === '/api/getUserList' && req.method === 'GET') {
        // 调用get_user_list()返回的是一个promise函数
        return  get_user_list({ // url_obj.query 获取get请求通过url传递过来的参数
                    start: url_obj.query.start,
                    length: url_obj.query.length
                })
    }
    if (url_obj.pathname === '/api/addUser' && req.method === 'POST') {
        return add_user(JSON.parse(req.body))
    }
    if (url_obj.pathname === '/api/getUserById' && req.method === 'POST') {
        return get_user_byId(JSON.parse(req.body))
    }
    if (url_obj.pathname === '/api/upDateUser' && req.method === 'POST') {
        return upDate_user(JSON.parse(req.body))
    }
    if (url_obj.pathname === '/api/deleteUser' && req.method === 'POST') {
        return delete_user(JSON.parse(req.body))
    }
}

module.exports = handleRouter
```

以上我输出了四个接口：

1. 查询用户（实现分页）

http://localhost:3000/api/getUserList?start=0&length=10

2. 新增用户

http://localhost:3000/api/addUser

3. 根据用户ID查询用户详情

http://localhost:3000/api/getUserById

4. 修改用户

http://localhost:3000/api/upDateUser

5. 删除用户

http://localhost:3000/api/deleteUser

## 4. 创建controller/user.js文件，用以编写sql命令，并处理sql执行完毕返回的数据

`controller/user.js`
```js
const query = require('./../connect/conn')

module.exports = {
    // 查询所有用户（分页）
    async get_user_list (params) {
        let {start, length} = params
        let sql = `SELECT COUNT(*) as count FROM use_list;SELECT * FROM use_list LIMIT ${start}, ${length}` // 返回user_list表总条数
        try {
            let result = await query(sql, [])
            //  JSON.parse(JSON.stringify(result1))，目的格式化sql返回的结果
            let result_json = JSON.parse(JSON.stringify(result))
            // 总数
            let count = result_json[0][0].count
            let data = result_json[1]
            // async/await 里面用return 返回的又是一个promise函数，需要在then()回调函数了接收这个return的值
            return {
                status: 1,
                code: '',
                msg: '',
                data: {
                    data: data,
                    iTotalDisplayRecords: count
                }
            }
        } catch (error) {
            return {
                status: -1,
                code: '1001',
                msg: error,
                data: {}
            }
        }
    },
    // 新增用户
    async add_user (params) {
        let {name, city, sex, tel, addr} = params
        let sql = `INSERT INTO use_list (name, city, sex, tel, addr) VALUE ('${name}', '${city}', '${sex}', '${tel}', '${addr}')`
        try {
            let result = await query(sql)
            let result_json = JSON.parse(JSON.stringify(result))
            return {
                status: 1,
                code: '',
                msg: '新增成功',
                data: true
            }
        } catch (error) {
            return {
                status: -1,
                code: '1001',
                msg: error,
                data: {}
            }
        }
    },
    // 根据id查询具体用户
    async get_user_byId (params) {
        let {id} = params
        let sql = `SELECT * FROM use_list WHERE id = ${id}`
        try {
            let result = await query(sql)
            let result_json = JSON.parse(JSON.stringify(result))
            return {
                status: 1,
                code: '',
                msg: '',
                data: result_json[0]
            }
        } catch (error) {
            return {
                status: -1,
                code: '1001',
                msg: error,
                data: {}
            }
        }
    },
    // 根据id更新用户信息
    async upDate_user (params) {
        let {id, name, city, sex, addr, tel} = params
        let sql = `UPDATE use_list SET name = '${name}', city = '${city}', sex = ${sex}, addr = '${addr}', tel = '${tel}' WHERE id = ${id}`
        try {
            let result = await query(sql)
            let result_json = JSON.parse(JSON.stringify(result))
            return {
                status: 1,
                code: '',
                msg: '更新用户成功',
                data: true
            }
        } catch (error) {
            return {
                status: -1,
                code: '1001',
                msg: error,
                data: {}
            }
        }
    },
    // 删除用户
    async delete_user (params) {
        let {id} = params
        let sql = `DELETE FROM use_list WHERE id = ${id}`
        try {
            let result = await query(sql)
            let result_json = JSON.parse(JSON.stringify(result))
            return {
                status: 1,
                code: '',
                msg: '删除用户成功',
                data: true
            }
        } catch (error) {
            return {
                status: -1,
                code: '1001',
                msg: error,
                data: {}
            }
        }
    }
}
```

## 5. 创建connect/conn.js，建立mysql连接池，专门执行sql操作

如果你想在本地运行此项目，那么你需要通过Navicat连接你的mysql，并且新建`test`数据库，并且在此数据库下新建表`use_list`

`connect/conn.js`
```js
// 创建mysql连接池

const mysql = require('mysql')

// 创建连接池
const pool = mysql.createPool({
    connectionLimit: 10, // 最大连接数10
    host: 'localhost',
    user: 'root',
    password: 'admin',
    port: '3306',
    database: 'test', // 数据库名
    multipleStatements: true
})

const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, conn) => {
            if (err) {
                reject(err)
                return
            }
            /**
             * sql -- sql语句
             * params sql语句动态参数
             */
            conn.query(sql, params, (err, res) => {
                conn.release() // 操作sql完毕，释放连接
                if (err) {
                    reject(err)
                    return
                }
                resolve(res)
            })
        })
    })
}

module.exports = query
```

## 6. 前端项目访问后端接口

具体前端如何配置跨域来访问后端接口，可以查看我创建的前端项目[vue-base-frame](https://github.com/darenone/vue-base-frame)，你可以把[vue-base-server](https://github.com/darenone/vue-base-server)和[vue-base-frame](https://github.com/darenone/vue-base-frame)这两个项目，克隆到你的本地，然后同时启动这两个项目，通过前端页面来实地操作，来了解前后端是如何进行通信的