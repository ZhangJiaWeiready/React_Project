# day01
## 1. 项目开发准备
    1). 项目描述: 整体业务功能/功能模块/主体的技术/开发模式
    2). 技术选型: 数据展现/用户交互/组件化, 后端, 前后台交互, 模块化, 项目构建/工程化, 其它
    3). API接口: 接口的4个组成部分, 接口文档, 对/调/测接口

## 2. git管理项目的常用操作
    1). 创建本地仓库
        创建.gitignore配置文件
        git init
        git add *
        git commit -m "xxx"
    2). 创建github远程仓库
        New Repository
        指定名称
        创建
    3). 将本地仓库推送到远程仓库
        git remote add origin https://github.com/zxfjd3g/170612_JSAdvance.git 关联远程仓库
        git push origin master
    
    4). push本地的更新 
        git add *
        git commit -m "xxx"
        git push origin master
    
    5). pull远程的更新
            git pull origin master
            
    6). 克隆github上的项目:
        git clone https://github.com/zxfjd3g/xxx.git

## 3. 搭建项目
    1). 使用create-react-app脚手架创建模板项目(工程化)
    2). 引入antd-mobile, 并实现按需打包和自定义主题
    3). 引入react-router-dom(v4): 
        HashRouter/Route/Switch
        history: push()/replace()
    4). 引入redux
        redux/react-redux/redux-thunk
        redux: createStore()/combineReducers()/applyMiddleware()
        react-redux: <Provider store={store}> / connect()(Xxx)
        4个重要模块: reducers/store/actions/action-types

## 4. 登陆/注册界面
    1). 创建3个1级路由: main/login/register
    2). 完成登陆/注册的静态组件
        antd组件: NavBar/WingBlank/WhiteSpace/List/InputItem/Radio/Button
        路由跳转: this.props.history.replace('/login')
        收集表单输入数据: state/onChange/变量属性名

## 5. 实现简单后台
    1). 使用webstorm创建基于node+express的后台应用
    2). 根据需求编写后台路由
    3). 使用postman测试后台接口
    4). 使用nodemon实现后台应用的自动重启动
    5). 路由回调函数的3步: 读取请求参数/处理/返回响应数据
    
    
# day02
## 1. 使用mongoose操作数据库
    1). 连接数据库
    2). 定义schema和Model
    3). 通过Model函数对象或Model的实例的方法对集合数据进行CRUD操作 
    
## 2. 注册/登陆后台处理
    1). models.js
        连接数据库: mongoose.connect(url)
        定义文档结构: schema
        定义操作集合的model: UserModel
    2). routes/index.js
        根据接口编写路由的定义
        注册: 流程
        登陆: 流程
        响应数据结构: {code: 0, data: user}, {code: 1, msg: 'xxx'}
    
## 3. 注册/登陆前台处理
    1). ajax
        ajax请求函数(通用): 使用axios库, 返回的是promise对象
        后台接口请求函数: 针对具体接口定义的ajax请求函数, 返回的是promise对象
        代理: 跨域问题/配置代理解决
        await/async: 同步编码方式实现异步ajax请求 
    2). redux
        store.js
          生成并暴露一个store管理对象
        reducers.js
          包含n个reducer函数
          根据老state和指定action来产生返回一个新的state
        actions.js
          包含n个action creator函数
          同步action: 返回一个action对象({type: 'XXX', data: xxx})
          异步action: 返回一个函数: disptach => {执行异步代理, 结束时dispatch一个同步action}
        action-types.js
          action的type名称常量
    3). component
        UI组件: 
            组件内部没有使用任何redux相关的API
            通过props接收容器组件传入的从redux获取数据
            数据类型: 一般和函数
        容器组件
            connect(
              state => ({user: state.user}),
              {action1, action2}
            )(UI组件)

# day03
## 1. 实现user信息完善功能
    1). 用户信息完善界面路由组件: 
        组件: dashen-info/laoban-info/header-selector
        界面
        收集用户输入数据
        注册2级路由
    2). 登陆/注册成功后的跳转路由计算
        定义工具函数
        计算逻辑分析
    3). 后台路由处理
    4). 前台接口请求函数
    5). 前台redux
        action-types
        异步action/同步action
        reducer
    6). 前台组件
        UI组件包装生成容器组件
        读取状态数据
        更新状态

## 2. 搭建整体界面
    1). 登陆状态维护
        后台将userid保存到cookie中
        前台读取cookie中的userid
        redux中管理user信息状态
        
    1). 实现自动登陆
        整体逻辑分析
        ajax请求根据cookie中的userid查询获取对应的user信息

# 
1. 聊天组件功能 chat.jsx -- 路由组件
    /chat/:userid
    因为id不一样所以需要这样设置,然后就可以在this.props.match.param中查看这个userid了
    点击列表用户的时候 push跳转到指定的路由
    1. 点击发送 
        from 谁发的 
        to 去哪里 -- this.props.match.parmas.userid
2. 消息列表 message.jsx 
3. 未读消息数量显示

一打开聊天 就会发送请求，然后把别人发送过来的消息 的read改为false
发送请求在 Didmount中发送请求，更新消息的未读状态