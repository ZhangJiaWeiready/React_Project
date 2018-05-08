/*
包含了n个接口请求的函数的模块
函数返回值为: promise
 */

import ajax from './ajax'

// 注册接口
export const reqRegister = (user) => ajax('/register', user, 'POST')
// 登陆接口
export const reqLogin = ({username, password}) => ajax('/login',{username, password}, 'POST')
// 更新用户接口
export const reqUpdateUser = (user) => ajax('/update', user, 'POST')

//获取用户信息
export const reqUser = () => ajax('/user','GET')

//获取用户列表
export const reqUserList = (type) => ajax('/userList',{type},'GET')

// 读取消息列表
export const reqChatMsgList = () => ajax('/msgList')


//修改消息为已读 因为到时候传值的时候需要的请求参数是一个对象
export const reqReadMsg = (from) => ajax('/readmsg',{from},'POST')