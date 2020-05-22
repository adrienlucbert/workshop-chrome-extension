import Controller from './Controller.js'
import autologin from './config.js'

let notifs = []

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
            notifs = json
            for (let notif of notifs) {
                console.log(notif.title)
            }
        })
        .catch(console.error)
}

const API = (message, from, send) => {
    switch (message.type) {
        case 'getNotifications':
            send({ ok: true, notifs: notifs })
        break
        default:
            send({ ok: false, message: 'Request type unknown' })
        break;
    }
    console.log(message)
    send({ ok: true, message: 'tata' })
}

chrome.runtime.onMessage.addListener(API)

chrome.runtime.onInstalled.addListener(install)
chrome.runtime.onStartup.addListener(init)

chrome.alarms.onAlarm.addListener(update)