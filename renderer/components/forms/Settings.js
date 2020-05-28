import ListErrors from '../common/ListErrors'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'

@inject('UserStore')
@observer
class SettingsForm extends Component {
  constructor () {
    super()

    this.state = {
      image: '',
      username: '',
      bio: '',
      email: '',
      password: ''
    }

    this.updateState = field => ev => {
      const state = this.state
      const newState = Object.assign({}, state, { [field]: ev.target.value })
      this.setState(newState)
    }

    this.submitForm = ev => {
      ev.preventDefault()

      const user = Object.assign({}, this.state)
      if (!user.password) {
        delete user.password
      }

      this.props.onSubmitForm(user)
    }
  }

  componentDidMount () {
    if (this.props.UserStore.currentUser) {
      Object.assign(this.state, {
        image: this.props.UserStore.currentUser.image || '',
        username: this.props.UserStore.currentUser.username,
        bio: this.props.UserStore.currentUser.bio || '',
        email: this.props.UserStore.currentUser.email
      })
    }
  }

  render () {
    return (
      <form onSubmit={this.submitForm}>
        <fieldset>

          <fieldset className='form-group'>
            <input
              className='form-control'
              type='text'
              placeholder='URL of profile picture'
              value={this.state.image}
              onChange={this.updateState('image')}
            />
          </fieldset>

          <fieldset className='form-group'>
            <input
              className='form-control form-control-lg'
              type='text'
              placeholder='Username'
              value={this.state.username}
              onChange={this.updateState('username')}
            />
          </fieldset>

          <fieldset className='form-group'>
            <textarea
              className='form-control form-control-lg'
              rows='8'
              placeholder='Short bio about you'
              value={this.state.bio}
              onChange={this.updateState('bio')}
            />
          </fieldset>

          <fieldset className='form-group'>
            <input
              className='form-control form-control-lg'
              type='email'
              placeholder='Email'
              value={this.state.email}
              onChange={this.updateState('email')}
            />
          </fieldset>

          <fieldset className='form-group'>
            <input
              className='form-control form-control-lg'
              type='password'
              placeholder='New Password'
              value={this.state.password}
              onChange={this.updateState('password')}
            />
          </fieldset>

          <button
            className='btn btn-lg btn-primary pull-xs-right'
            type='submit'
            disabled={this.props.UserStore.updatingUser}
          >
            Update Settings
          </button>

        </fieldset>
      </form>
    )
  }
}

@inject('UserStore', 'UserStore')
@withRouter
@observer
class Settings extends Component {
  handleClickLogout = () =>
    this.props.UserStore.logout()
      .then(() => this.props.history.replace('/'));

  render () {
    return (
      <div className='settings-page'>
        <div className='container page'>
          <div className='row'>
            <div className='col-md-6 offset-md-3 col-xs-12'>

              <h1 className='text-xs-center'>Your Settings</h1>

              <ListErrors errors={this.props.UserStore.updatingUserErrors} />

              <SettingsForm
                currentUser={this.props.UserStore.currentUser}
                onSubmitForm={user => this.props.UserStore.updateUser(user)} />

              <hr />

              <button
                className='btn btn-outline-danger'
                onClick={this.handleClickLogout}
              >
                Or click here to logout.
              </button>

            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Settings
