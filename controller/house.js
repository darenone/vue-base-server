const query = require('./../connect/conn');
const {data: provinceList} = require('./../lib/sysOrgList.json');

module.exports = {
    // 查询所有房子信息（分页）
    async get_house_list (params) {
        let {start, length} = params
        let sql = `SELECT COUNT(*) as count FROM house;SELECT  * FROM  (SELECT * FROM house ORDER BY startTime DESC) as a LIMIT ${start}, ${length}` // 返回house表总条数
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
    // 新增房子
    async add_house (params) {
        let {name, number, areaCode, startTime, price, addr, status, remark} = params;
        let area = '';
        if (areaCode) {
            provinceList.forEach(ele1 => {
                // 四川
                if (ele1.orgCode == 26) {
                    ele1.children.forEach(ele2 => {
                        // 成都
                        if (ele2.cityCode == 2601) {
                            ele2.children.forEach(ele3 => {
                                if (ele3.areaCode == areaCode) {
                                    area = ele3.areaName;
                                }
                            })
                        }
                    })
                }
            });
        }
        let sql = `INSERT INTO house
        (name, number, area, areaCode, startTime, price, addr, status, remark)
        VALUE
        ('${name}', '${number}', '${area}', '${areaCode}', '${startTime}', '${price}', '${addr}', '${status}', '${remark}')`
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
    // 根据id查询具体房子
    async get_house_byId (params) {
        let {id} = params
        let sql = `SELECT * FROM house WHERE id = ${id}`
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
    // 根据id更新房子信息
    async upDate_house (params) {
        let {id, name, number, areaCode, startTime, price, addr, status, remark} = params;
        let area = '';
        if (areaCode) {
            provinceList.forEach(ele1 => {
                // 四川
                if (ele1.orgCode == 26) {
                    ele1.children.forEach(ele2 => {
                        // 成都
                        if (ele2.cityCode == 2601) {
                            ele2.children.forEach(ele3 => {
                                if (ele3.areaCode == areaCode) {
                                    area = ele3.areaName;
                                }
                            })
                        }
                    })
                }
            });
        }
        let sql = `UPDATE house SET
        name ='${name}',
        number = '${number}',
        area = '${area}',
        areaCode = '${areaCode}',
        startTime = '${startTime}',
        price = '${price}',
        addr = '${addr}',
        remark = '${remark}',
        status = '${status}'
        WHERE id = ${id}`
        try {
            let result = await query(sql)
            let result_json = JSON.parse(JSON.stringify(result))
            return {
                status: 1,
                code: '',
                msg: '更新房子成功',
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
    // 删除房子
    async delete_house (params) {
        let {id} = params
        let sql = `DELETE FROM house WHERE id = ${id}`
        try {
            let result = await query(sql)
            let result_json = JSON.parse(JSON.stringify(result))
            return {
                status: 1,
                code: '',
                msg: '删除房子成功',
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
    // 多条件查询
    async get_house_params (params) {
        let {name, status, date, start, length} = params;
        let sql1 = '';
        let sql2 = '';
        if (name) {
            if (status === 0 || status == 1 || status == 2) {
                if (date) {
                    // 查询总数
                    sql1 = `SELECT COUNT(*) FROM house WHERE name = '${name}' AND status = ${status} AND YEAR(startTime) = '${date.slice(0, 4)}' AND MONTH(startTime) = '${date.slice(5, 7)}'`;
                    // 分页查询
                    sql2 = `SELECT * FROM house WHERE name = '${name}' AND status = ${status} AND YEAR(startTime) = '${date.slice(0, 4)}' AND MONTH(startTime) = '${date.slice(5, 7)}' LIMIT ${start}, ${length}`;
                } else {
                    sql1 = `SELECT COUNT(*) FROM house WHERE name = '${name}' AND status = ${status}`;
                    sql2 = `SELECT * FROM house WHERE name = '${name}' AND status = ${status} LIMIT ${start}, ${length}`;
                }
            } else {
                if (date) {
                    sql1 = `SELECT COUNT(*) FROM house WHERE name = '${name}' AND YEAR(startTime) = '${date.slice(0, 4)}' AND MONTH(startTime) = '${date.slice(5, 7)}'`;
                    sql2 = `SELECT* FROM house WHERE name = '${name}' AND YEAR(startTime) = '${date.slice(0, 4)}' AND MONTH(startTime) = '${date.slice(5, 7)}' LIMIT ${start}, ${length}`;
                } else {
                    sql1 = `SELECT COUNT(*) FROM house WHERE name = '${name}'`;
                    sql2 = `SELECT * FROM house WHERE name = '${name}' LIMIT ${start}, ${length}`;
                }
            }
        } else {
            if (status === 0 || status == 1 || status == 2) {
                if (date) {
                    sql1 = `SELECT COUNT(*) FROM house WHERE status = ${status} AND YEAR(startTime) = '${date.slice(0, 4)}' AND MONTH(startTime) = '${date.slice(5, 7)}'`;
                    sql2 = `SELECT * FROM house WHERE status = ${status} AND YEAR(startTime) = '${date.slice(0, 4)}' AND MONTH(startTime) = '${date.slice(5, 7)}' LIMIT ${start}, ${length}`;
                } else {
                    sql1 = `SELECT COUNT(*) FROM house WHERE status = ${status}`;
                    sql2 = `SELECT * FROM house WHERE status = ${status} LIMIT ${start}, ${length}`;
                }
            } else {
                if (date) {
                    sql1 = `SELECT COUNT(*) FROM house WHERE YEAR(startTime) = '${date.slice(0, 4)}' AND MONTH(startTime) = '${date.slice(5, 7)}'`;
                    sql2 = `SELECT * FROM house WHERE YEAR(startTime) = '${date.slice(0, 4)}' AND MONTH(startTime) = '${date.slice(5, 7)}' LIMIT ${start}, ${length}`;
                } else {
                    sql1 = `SELECT COUNT(*) FROM house`;
                    sql2 = `SELECT * FROM house LIMIT ${start}, ${length}`;
                }
            }
        }
        try {
            let result1 = await query(sql1);
            let result_json1 = JSON.parse(JSON.stringify(result1));
            let result2 = await query(sql2);
            let result_json2 = JSON.parse(JSON.stringify(result2));
            return {
                status: 1,
                code: '',
                msg: '',
                data: {
                    data: [...result_json2],
                    iTotalDisplayRecords: result_json1[0]['COUNT(*)']
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
    }
}