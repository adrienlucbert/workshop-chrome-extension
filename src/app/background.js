import Controller from './Controller.js'
import autologin from './config.js'

let readNotifs = []
let unreadNotifs = []

const install = () => {
    console.log('Install..')
    init()
}

const init = () => {
    console.log('Init...')
    chrome.alarms.create('refresh', { periodInMinutes: 3 })
    update()
}

const update = () => {
    console.log('Update...')
    Controller.getNotifications(autologin)
        .then(json => {
            unreadNotifs = json.filter(notif => {
                return !readNotifs.find(({ id }) => id === notif.id)
            })
            chrome.browserAction.setBadgeBackgroundColor({
                color: [255, 0, 0, 255]
            })
            if (unreadNotifs.length > 0) {
                chrome.browserAction.setBadgeText({
                    text: String(unreadNotifs.length)
                })
            } else {
                chrome.browserAction.setBadgeText({
                    text: ''
                })
            }
        })
        .catch(console.error)
}

const API = (message, from, send) => {
    switch (message.type) {
        case 'getNotifications':
            send({ ok: true, notifs: readNotifs.concat(unreadNotifs) })
        break
        case 'readNotifications':
            readNotifs = readNotifs.concat(unreadNotifs)
            unreadNotifs = []
            update()
            send({ ok: true })
        break
        default:
            send({ ok: false, message: 'Request type unknown' })
        break;
    }
}

chrome.runtime.onMessage.addListener(API)

chrome.runtime.onInstalled.addListener(install)
chrome.runtime.onStartup.addListener(init)

chrome.alarms.onAlarm.addListener(update)