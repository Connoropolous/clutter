import axios from 'axios'

export function send (namespace, fnName, data) {
    const stringified = typeof data === "object" ? JSON.stringify(data) : data
    return axios.post(`/fn/${namespace}/${fnName}`, stringified)
        .then(res => {
            if (typeof res.data === "string" && res.data.indexOf("Error") > -1) {
                return Promise.reject(new Error(res.data))
            }
            return Promise.resolve(res.data)
        })
        .catch(err => {
            console.log(err)
        })
}

export default function hcMiddleware (store) {
    return next => action => {
        const { type, meta } = action
        if (!(meta && meta.isHc)) return next(action)
        // the rest will be handled by redux-promises
        let sendRequest = send(meta.namespace, type, meta.data)
        sendRequest = meta.then ? sendRequest.then(meta.then) : sendRequest
        const newAction = {
            ...action,
            payload: sendRequest,
            meta: {
                ...meta,
                isHc: false
            }
        }
        return next(newAction)
    }
}