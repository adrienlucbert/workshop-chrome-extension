import autologin from './config.js'
import ApiRequester from './ApiRequester.js'

ApiRequester.fetch(autologin, '/user/notification/message')
    .then(json => {
        for (let notif of json) {
            console.log(notif.title)
        }
    })
    .catch(console.error)