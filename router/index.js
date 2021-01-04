const url = require('url')
const { get_user_list,  add_user, get_user_byId, upDate_user, delete_user} = require('./../controller/user');
const { get_house_list,  add_house, get_house_byId, upDate_house, delete_house, get_house_params} = require('./../controller/house');
const { get_routeAll} = require('./../controller/route');
function handleRouter(req, res) {
    let url_obj = url.parse(req.url, true) // 获取请求的地址
    // 用户
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
    // 房子
    if (url_obj.pathname === '/api/getHouseList' && req.method === 'GET') {
        return  get_house_list({ // url_obj.query 获取get请求通过url传递过来的参数
                    start: url_obj.query.start,
                    length: url_obj.query.length
                })
    }
    if (url_obj.pathname === '/api/addHouse' && req.method === 'POST') {
        return add_house(JSON.parse(req.body))
    }
    if (url_obj.pathname === '/api/getHouseById' && req.method === 'POST') {
        return get_house_byId(JSON.parse(req.body))
    }
    if (url_obj.pathname === '/api/upDateHouse' && req.method === 'POST') {
        return upDate_house(JSON.parse(req.body))
    }
    if (url_obj.pathname === '/api/deleteHouse' && req.method === 'POST') {
        return delete_house(JSON.parse(req.body))
    }
    if (url_obj.pathname === '/api/getHouse' && req.method === 'POST') {
        return get_house_params(JSON.parse(req.body))
    }
    // 地铁线路
    if (url_obj.pathname === '/api/getRouteAll' && req.method === 'POST') {
        return get_routeAll(JSON.parse(req.body))
    }
}

module.exports = handleRouter