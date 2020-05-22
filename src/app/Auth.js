import ApiRequester from './ApiRequester.js'

class Auth {
    /**
     * Validate autologin link and store it
     * 
     * @param {String} autologin intranet autologin link
     */
    static register(autologin) {
        const url = '/user/'
        return ApiRequester.fetch(autologin, url)
            .then(json => {
                if (!json['login'])
                    throw new Error('Invalid autologin link')
                chrome.storage.local.set({ autologin: autologin })
            })
            .catch(() => {
                return new Error('Invalid autologin link')
            })
    }

    /**
     * Retrieve autologin link from local storage if possible
     * 
     * @returns {Bool} whether autologin link could be retrieved or not
     */
    static login() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(['autologin'], store => {
                if (!store.autologin)
                    return reject()
                resolve(store.autologin)
            })
        })
    }
}

export default Auth