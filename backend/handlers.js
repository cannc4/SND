const userStore = require('./stores/user-store')
const projectStore = require('./stores/project-store')

// import { getById } from './stores/project-store';

const handlers = new Map()
function registerHandler (event, handler) {
  handlers.set(event, handler)
}
async function handleRequest (event, data, onProgress) {
  if (handlers.has(event) && typeof handlers.get(event) === 'function') {
    return handlers.get(event)(data, onProgress)
  }
}

registerHandler('fetch-user', () => userStore.get())

registerHandler('set-user', (data) => {
  const user = new userStore.User(data.email, data.jwt, data.projectData)
  return userStore.set(user)
})

registerHandler('fetch-projects', () => projectStore.list())
registerHandler('delete-project', (projectId) =>
  projectStore.remove(projectId)
)
registerHandler('reset-projects', () => projectStore.reset())

module.exports = { handleRequest }
