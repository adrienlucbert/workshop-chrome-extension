import ApiRequester from './ApiRequester.js'

class Auth {
    /**
     * Verify autologin token validity
     * 
     * @param {String} autologin intranet autologin link
     */
    static validateToken(autologin) {
        const url = '/user/'
        return ApiRequester.fetch(autologin, url)
            .then(json => {
                if (!json['login'])
                    throw new Error('Invalid autologin link')
            })
            .catch(() => {
                throw new Error('Invalid autologin link')
            })
    }

    /**
     * Validate autologin link and store it
     * 
     * @param {String} autologin intranet autologin link
     */
    static register(autologin) {
        return this.validateToken(autologin)
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
                this.validateToken(store.autologin)
                    .then(() => {
                        resolve(store.autologin)
                    })
                    .catch(reject)
            })
        })
    }
}

export default Auth