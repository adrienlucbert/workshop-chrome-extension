class Store {
    static set(name, value) {
        return new Promise((resolve, reject) => {
            const data = {}
            data[name] = value
            chrome.storage.local.set(data, () => {
                if (chrome.runtime.lastError !== undefined)
                    return reject(chrome.runtime.lastError.message)
                resolve()
            })
        })
    }

    static get(name) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get([ name ], storage => {
                if (chrome.runtime.lastError !== undefined)
                    return reject(chrome.runtime.lastError.message)
                resolve(storage[name])
            })
        })
    }
}

export default Store