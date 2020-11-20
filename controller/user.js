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