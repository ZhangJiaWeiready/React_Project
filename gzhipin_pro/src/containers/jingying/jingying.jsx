//精英的主路由import React,{Component} from 'react'import {connect} from 'react-redux'import UserList from '../../components/userList/userList'import {getUserList} from '../../redux/actions'class Jingying extends Component{    componentDidMount () {        //获取jingying的列表        this.props.getUserList('laoban')    }    render(){        return(            <div>                <UserList userList={this.props.userList}/>            </div>        )    }}export default connect(    state=>({userList:state.userList}),    {getUserList})(Jingying)