/**
 * Use chrome.runtime.sendMessage wrapped in a Promise
 * 
 * @param {any} message message content
 */
const sendMessagePromise = (message) => {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(message, response => {
            if (!response.ok)
                return reject(response.message)
            resolve(response)
        })
    })
}

export default sendMessagePromise