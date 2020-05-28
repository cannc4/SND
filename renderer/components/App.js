import React, { Component } from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import Header from './layout/MenuBar'
import Home from './layout/Home'
import Login from './forms/Login'
import Register from './forms/Register'

@inject('TokenStore', 'UserStore')
@withRouter
@observer
export default class App extends Component {

  componentDidMount() {
    this.props.UserStore.pullUser()
      .then(this.props.TokenStore.setAppLoaded)
      .catch(error => {
        if (error.response 
          && error.response.status === 401) {
          this.props.history.push('/login')
        }
      })
  }


  render() {
    if (this.props.TokenStore.appLoaded && this.props.TokenStore.getToken) {
      return (
        <div>
          <Header />
          <Home />
        </div>
      )
    }

    return (
      <div>
        <Header/>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/" component={Home} />
        </Switch>
      </div>
    )
  }
}