var express = require('express');
var router = express.Router();
const md5 = require('blueimp-md5')
const {UserModel} = require('../db/models')  // 因为是exports 所以说用{
const filter = {password:0,_v:0} // 表示不要这个密码
/*cookie (name,value)*/
/*注册路由*/
router.post('/register', function (req, res) {
    // 读取请求参数数据
    const {username, password, type} = req.body
    // 处理: 判断用户是否已经存在, 如果存在, 返回提示错误的信息, 如果不存在, 保存
    // 查询(根据username)
    UserModel.findOne({username}, function (err, user) {
        // 如果user有值(已存在)
        if(user) {
            // 返回提示错误的信息
            res.send({code: 1, msg: '此用户已存在'})
        } else { // 没值(不存在)
            // 保存
            new UserModel({username, type, password:md5(password)}).save(function (error, user) {

                // 生成一个cookie(userid: user._id), 并交给浏览器保存
                res.cookie('userid', user._id, {maxAge: 1000*60*60*24})
                // 返回包含user的json数据
                const data = {username, type, _id: user._id} // 响应数据中不要携带password
                res.send({code: 0, data})
            })
        }
    })
    // 返回响应数据
})

/*登录路由*/
router.post('/login',function (req, res) {
    const {username,password} = req.body
    // 判断用户名和密码是否和数据库中的匹配 如果匹配返回登录成功
    UserModel.findOne({username,password:md5(password)},filter,function (err, user) {
        if(user){
            // 匹配成功 登录
            res.cookie('userid',user._id,{maxAge:1000*60*60*24})
            res.send({code:0,data:{user}})
        } else{
            res.send({code:1,msg:"用户名或密码错误"})
        }
    })
})

/*更新用户信息的路由*/
router.post('/update',function (req,res) {
    //得到提交的用户信息
    /*
    *  更新用户信息的时候需要 user_id
    * */
    /*
    * 先从请求的cookie中获得id
    *   req.cookies 获取cookie对象
    * */
    const userid = req.cookies.userid
    if(!userid){
       return res.send({code:1,msg:'请先登录'})
    }
    //存在的话根据userid更新对应的user文档数据
    const user = req.body
    //首先通过_id找到对应的信息 用户然后将添加的信息添加到对应的用户数据中 存储起来
    UserModel.findByIdAndUpdate({_id:userid},user,function (err,oldUser){
        // 如果没有对应的use说明cookie不存在 是一个坏的 需要将这个cookie删掉
        if(!oldUser){
            // 通知浏览器删除 userid cookie // 删除完之后返回一个提示信息
            res.clearCookie('userid')
            res.send({code:1,msg:'请先登录'})
        }else{
            const {username,_id,type} = oldUser
            // assign 对象的合并，
            const data = Object.assign(user,{username,_id,type})
            res.send({code:0,data})
        }
    })
})
//获取用户信息的路由
router.get('/user',function (req, res) {
    const userid = req.cookies.userid
    if(!userid){
        return res.send({code:1,msg:'请先登录'})
    }
    UserModel.findOne({_id:userid},filter,function (err, user) {
        res.send({code:0,data:user})
    })


})
module.exports = router;
