const Store = require('./store')

const defaultDoc = 'store'
const objectName = 'user'
const defaultValue = {}
let userStore

function init () {
  userStore = new Store(defaultDoc, objectName, defaultValue)
  return userStore
}

function User (email, jwt, projectData) {
  this.email = email
  this.jwt = jwt
  this.projectData = projectData
}

function set (user) {
  userStore.set(user)
  return user
}

function get () {
  return userStore.get()
}

function reset () {
  userStore.set(defaultValue)
  return []
}

console.log('USER PASSED')

module.exports = { init, User, get, set, reset }
