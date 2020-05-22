import Controller from './Controller.js'
import Store from './Store.js'

let autologin = undefined
let readNotifs = []
let unreadNotifs = []

const install = () => {
    console.log('Install..')
    init()
}

const init = async () => {
    console.log('Init...')
    chrome.alarms.create('refresh', { periodInMinutes: 3 })
    autologin = await Store.get('autologin')
    update()
}

const update = () => {
    console.log('Update...')
    return new Promise(async (resolve, reject) => {
        try {
            const json = await Controller.getNotifications(autologin)
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
            console.log(json)
            resolve()
        } catch (err) {
            reject(err)
        }
    })
}

const API = (message, from, send) => {
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
            send({ ok: true, isLoggedIn: Boolean(autologin) })
        break
        case 'register':
            autologin = message.autologin
            Store.set('autologin', message.autologin)
            send({ ok: true })
        break
        default:
            send({ ok: false, message: 'Request type unknown' })
        break
    }
    return true
}

chrome.runtime.onMessage.addListener(API)

chrome.runtime.onInstalled.addListener(install)
chrome.runtime.onStartup.addListener(init)

chrome.alarms.onAlarm.addListener(update)