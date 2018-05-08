var express = require('express');
var router = express.Router();
const md5 = require('blueimp-md5')
const {UserModel,ChatModel} = require('../db/models')  // 因为是exports 所以说用{
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

//获取用户信息的列表的路由
router.get('/userList',function (req, res) {
    //通过type 获取对应的用户列表
    const {type} = req.query
   console.log(req.query.type)
    UserModel.find({type},filter,function (err,users) {

        if(users){
            return res.send({code:0,data:users})
        }else{
            return res.send({code:1,msg:'列表为空'})
        }
    })
})

// 获取当前用户所有的相关聊天信息列表
router.get('/msgList',function (req, res) {
    //获取cookie中的userid
    const userid = req.cookies.userid
    UserModel.find(function (err, usersDoc) {
        // docModels是一个数组 所有的用户列表
        //users 是所有用户的信息 对象 对象包含用户的username和
        const users = {}
        usersDoc.forEach(doc =>{
            users[doc._id] ={username:doc.username,header:doc.header}
        })
        ChatModel.find({'$or':[{from:userid},{to:userid}]},filter,function (err,chatMsgs) {
            res.send({code:0,data:{users,chatMsgs}})

        })

        // 发送给服务器两个对象
            // users -- 所有的user的username和 头像
            // chatMsg -- 不管是from或者to包含着我的id都要发送过去，对象，read/_id/from/to
    })
})

//修改指定消息为已读
router.post('/readmsg',function (req, res) {
    // from -- 发送消息的人
    // const to = req.body.from
    const from = req.body.from

    // to -- 当前登录的用户
    // const from = req.cookies.userid
    const to = req.cookies.userid

    /*
        1. 更新数据库中的chat数据
            参数一 查询条件
            参数二 更新为指定的数据对象
            参数三 是否一次更新多条，默认只更新一条
            参数四 更新完成的回调函数
    */
    // 找到 发送消息的用户 和当前登录用户 和 read 为false的 信息
    // 将read 改为true
    //multi: true -- 更新多个
    ChatModel.update({from,to,read:false},{read:true},{multi: true},function (err, doc) {
        console.log('/readMsg',doc)
        //doc.nModified -- 更新的个数
        res.send({code:0,data:doc.nModified})
    })
})

module.exports = router;
