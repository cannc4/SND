import { withRouter, Link } from 'react-router-dom'
import ListErrors from '../common/ListErrors'
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

@inject('UserStore')
@withRouter
@observer
export default class Login extends Component {

  componentWillUnmount() {
    this.props.UserStore.reset()
  }

  handleEmailChange = e => this.props.UserStore.setEmail(e.target.value)
  handlePasswordChange = e => this.props.UserStore.setPassword(e.target.value)
  handleSubmitForm = (e) => {
    e.preventDefault()
    this.props.UserStore.login()
      .then(() => this.props.history.replace('/'))
  };

  render() {
    const { values, errors, inProgress } = this.props.UserStore

    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">

            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign In</h1>
              <p className="text-xs-center">
                <Link to="/register">Register</Link>
              </p>

              <ListErrors errors={errors} />

              <form onSubmit={this.handleSubmitForm}>
                <fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="email"
                      placeholder="Email"
                      value={values.email}
                      onChange={this.handleEmailChange}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="password"
                      placeholder="Password"
                      value={values.password}
                      onChange={this.handlePasswordChange}
                    />
                  </fieldset>

                  <button
                    className="btn btn-lg btn-primary pull-xs-right"
                    type="submit"
                  >
                    Sign in
                  </button>

                </fieldset>
              </form>
            </div>

          </div>
        </div>
      </div>
    )
  }
}
