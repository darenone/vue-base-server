const query = require('./../connect/conn');

module.exports = {
    async get_routeAll (params) {
        let {id} = params
        let sql = `SELECT * FROM route WHERE line = ${id}`
        try {
            let result = await query(sql)
            let result_json = JSON.parse(JSON.stringify(result))
            return {
                status: 1,
                code: '',
                msg: '',
                data: result_json
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