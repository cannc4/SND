import { Link } from 'react-router-dom'
import ListErrors from '../common/ListErrors'
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

@inject('UserStore')
@observer
export default class Register extends Component {

  componentWillUnmount() {
    this.props.UserStore.reset()
  }

  handleUsernameChange = e => this.props.UserStore.setUsername(e.target.value);
  handleEmailChange = e => this.props.UserStore.setEmail(e.target.value);
  handlePasswordChange = e => this.props.UserStore.setPassword(e.target.value);
  handleSubmitForm = (e) => {
    e.preventDefault()
    this.props.UserStore.register()
      .then(() => this.props.history.replace('/'))
  };

  render() {
    const { values, errors, inProgress } = this.props.UserStore

    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">

            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign Up</h1>
              <p className="text-xs-center">
                <Link to="/login">
                  Have an account?
                </Link>
              </p>

              <ListErrors errors={errors} />

              <form onSubmit={this.handleSubmitForm}>
                <fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Username"
                      value={values.username}
                      onChange={this.handleUsernameChange}
                    />
                  </fieldset>

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