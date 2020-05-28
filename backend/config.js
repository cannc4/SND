const config = {}

function setConfig (newConfig) {
  for (const key in newConfig) {
    config[key] = newConfig[key]
  }
}

module.exports.config = config
module.exports.setConfig = setConfig
