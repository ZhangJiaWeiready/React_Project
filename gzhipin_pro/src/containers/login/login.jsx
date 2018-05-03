import React,{Component} from 'react'import {    NavBar,    WingBlank,    List,    InputItem,    WhiteSpace,    Button} from 'antd-mobile'import {Redirect} from 'react-router-dom'import {connect} from 'react-redux'import Logo from '../../components/logo/logo'import {login} from '../../redux/actions'class Login extends Component{    state= {        username:"",        password:""    }    handleChange = (name,val) => {        this.setState({            [name]:val        })    }    loginMsg = () =>{        this.props.login(this.state)    }    toRegister =() =>{        this.props.history.replace('/register')}    render(){        const {msg,redirectTo} = this.props.user        if(redirectTo){            return <Redirect to={redirectTo}/>        }        return(            <div>                <NavBar>硅谷直聘</NavBar>                <Logo />                <WingBlank>                    <List>                        {msg?<div className='error-msg'>{msg}</div>:null}                        <WhiteSpace/>                        <InputItem onChange={ (val) => {this.handleChange('username',val)}} placeholder='请输入用户名'>用户名&nbsp;:</InputItem>                        <WhiteSpace/>                        <InputItem  type='password' onChange={ (val) => {this.handleChange('password',val)}} placeholder='请输入密码' >密&nbsp;&nbsp;&nbsp;码&nbsp;:</InputItem>                        <WhiteSpace/>                        <Button type='primary' onClick={this.loginMsg}>登&nbsp;&nbsp;&nbsp;录</Button>                        <WhiteSpace/>                        <Button onClick={this.toRegister}>还没有账户</Button>                    </List>                </WingBlank>            </div>        )    }}export default connect(    state =>({user:state.user}),  {login})(Login)