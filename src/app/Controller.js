import ApiRequester from './ApiRequester.js'

/**
 * Application controller
 */
class Controller {
    /**
     * List notifications received by the user
     * 
     * @param {String} autologin intranet autologin link
     */
    static getNotifications(autologin) {
        return new Promise((resolve, reject) => {
            const url = `/user/notification/message`
            ApiRequester.fetch(autologin, url)
                .then(resolve)
                .catch(reject)
        })
    }
}

export default Controller