import { ipcRenderer as ipc } from 'electron-better-ipc'
import { v4 as uuid } from 'uuid'

export async function request (event, data = undefined, opts = {}) {
  const id = uuid()
  console.log('here')
  const progress = typeof opts.onProgress === 'function'
  let removeProgressSubscription

  if (progress) {
    removeProgressSubscription = subscribe(`progress-${id}`, (progress) =>
      opts.onProgress(progress)
    )
  }

  const { response, error } = await ipc.callMain('to-worker', {
    id,
    event,
    data,
    progress
  })
  console.log(response)
  console.log(error)
  console.log(event)
  console.log(data)

  if (progress && removeProgressSubscription) {
    removeProgressSubscription()
  }

  if (error) {
    throw new Error(error)
  }
  return response
}

export function subscribe (subscriptionEvent, handler) {
  return ipc.answerMain('to-renderer', ({ event, data }) => {
    if (event !== subscriptionEvent) {
      return
    }

    handler(data)
  })
}
