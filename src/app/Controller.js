import ApiRequester from './ApiRequester.js'

class Controller {
    static getNotifications(autologin) {
        return ApiRequester.fetch(autologin, '/user/notification/message')
    }
}

export default Controller