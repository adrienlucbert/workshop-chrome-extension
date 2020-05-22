const sendMessagePromise = (message) => {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(message, response => {
            if (!response.ok)
                return reject(new Error(response.message))
            resolve(response)
        })
    })
}

export default sendMessagePromise