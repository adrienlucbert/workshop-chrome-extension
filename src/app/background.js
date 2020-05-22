import Controller from './Controller.js'
import Auth from './Auth.js'

/**
 * Background script data
 */

let autologin = null
let readNotifs = []
let unreadNotifs = []

/**
 * Background script hooks
 */

const init = () => {
    chrome.alarms.create('refresh', { periodInMinutes: 3 })
    Auth.login()
        .then((res) => {
            autologin = res
            update()
        })
        .catch(() => {})
}

const update = async () => {
    if (!autologin)
        return
    const promise = Controller.getNotifications(autologin)
        .then(notifs => {
            unreadNotifs = notifs.filter(notif => {
                return !readNotifs.find(({ id }) => {
                    return id == notif.id
                })
            })
            if (unreadNotifs.length > 0) {
                chrome.browserAction.setBadgeBackgroundColor({
                    color: [255, 0, 0, 255]
                })
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
    return promise
}

/**
 * Background script event listeners
 */

chrome.runtime.onInstalled.addListener(init)
chrome.runtime.onStartup.addListener(init)

chrome.runtime.onMessage.addListener((message, from, send) => {
    switch (message.type) {
        case 'getNotifications':
            update()
                .then(() => {
                    send({ ok: true, data: readNotifs.concat(unreadNotifs) })
                })
                .catch(err => {
                    send({ ok: false, message: err.message })
                })
            break
        case 'readNotifications':
            readNotifs = readNotifs.concat(unreadNotifs)
            unreadNotifs = []
            update()
            send({ ok: true })
            break
        case 'isLoggedIn':
            send({ ok: true, isLoggedIn: autologin !== null })
            break
        case 'register':
            Auth.register(message.autologin)
                .then(() => {
                    autologin = message.autologin
                    send({ ok: true })
                })
                .catch(err => {
                    autologin = null
                    send({ ok: false, message: err.message })
                })
            break
        default:
            send({ ok: false, message: 'Unknown request' })
            break
    }
    return true // Fix for 'The message port closed before a response was received'
    // https://www.edureka.co/community/65627/unchecked-runtime-lasterror-message-response-received-chrome
})

chrome.alarms.onAlarm.addListener(update)
