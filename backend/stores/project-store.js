const Store = require('./store')

const defaultDoc = 'store'
const objectName = 'projects'
const defaultValue = []
let projectStore

function init () {
  projectStore = new Store(defaultDoc, objectName, defaultValue)
  return projectStore
}

function Project (id, name, data) {
  this.id = id
  this.name = name
  this.data = data
}

function append (project) {
  const projects = projectStore.get()
  if (project.id == null || project.name == null || project.data == null) {
    throw new Error('invalid project id/name/data')
  }

  projects.push(project)
  projectStore.set(projects)

  return projects
}

function list () {
  return projectStore.get()
}

function reset () {
  projectStore.set(defaultValue)
  return list()
}

function getById (projectId) {
  return projectStore.get().find(({ id }) => id === projectId)
}

function remove (id) {
  let projects = projectStore.get()
  let index = projects.findIndex(project => project.id === id)
  if (index > -1) {
    projects.splice(index, 1)
  }
  projectStore.set(projects)
  return projectStore.get()
}

console.log('PROJECT STORE CREATED')

module.exports = { init, Project, append, reset, list, getById, remove }
