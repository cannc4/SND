function pushEvent (event, data = undefined) {
  process.send({
    pushEvent: {
      event,
      data
    }
  })
}

module.exports = pushEvent
