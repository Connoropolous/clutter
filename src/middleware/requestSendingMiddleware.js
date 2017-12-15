export default function (store) {
  return next => action => {
    const { payload, meta, type } = action
    // if its a network request
    // fire an action that indicates the request has
    // been sent
    if (payload && payload.then) {
      const requestSendingAction = {
        payload: null,
        type: type + 'Sent',
        meta
      }
      store.dispatch(requestSendingAction)
    }
    return next(action)
  }
}