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