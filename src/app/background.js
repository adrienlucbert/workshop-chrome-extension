import Controller from './Controller.js'

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
    autologin = "https://intra.epitech.eu/auth-24dbf04d6c47af44e400491edcc22387839e5836"
    chrome.alarms.create('refresh', { periodInMinutes: 3 })
    update()
}

const update = () => {
    Controller.getNotifications(autologin)
        .then(notifs => {
            unreadNotifs = notifs.filter(notif => {
                return !readNotifs.find(({ id }) => {
                    return id == notif.id
                })
            })
            if (unreadNotifs.length > 0) {
                chrome.browserAction.setBadgeBackgroundColor({
                    color: [ 255, 0, 0, 255 ]
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
}

/**
 * Background script event listeners
 */

chrome.runtime.onInstalled.addListener(init)

chrome.runtime.onMessage.addListener((message, from, send) => {
    switch (message.type) {
        case 'getNotifications':
            send({ ok: true, data: readNotifs.concat(unreadNotifs) })
            break
        case 'readNotifications':
            readNotifs = readNotifs.concat(unreadNotifs)
            unreadNotifs = []
            update()
            send({ ok: true })
            break
        default:
            send({ ok: false, message: 'Unknown request' })
            break
    }
})

chrome.alarms.onAlarm.addListener(update)
