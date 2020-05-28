const { v4 } = require('uuid')

/* these are our migrations of the store scheme — the store is a JSON-based
 * database which contains information about users and projects. as changes
 * on the store scheme happen over time, we can issue migrations here.
 *
 * make sure to check whether a particular key already has been set — for
 * instance, a new installation might already have a user set up, but no
 * projects. if these users update to a newer version, migrations might crash
 * if they rely on the `projects` key to be set.
 *
 * also, make sure to update the `storeVersion` here if you create a
 * new migration, so that new versions adhere to this version.
 */
const storeVersion = '0.0.1'
const migrations = {}

migrations['0.01.1'] = store => {
  if (!store.projects) {
    return store
  }

  const projects = store.projects.map(project => {
    if (project.id) {
      return project
    }

    return {
      ...project,
      id: v4()
    }
  })

  return {
    ...store,
    projects
  }
}

module.exports = [storeVersion, migrations]
