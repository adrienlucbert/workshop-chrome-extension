import Controller from './Controller.js'
import Auth from './Auth.js'
import Store from './Store.js'

/**
 * Background script hooks
 */

const init = async () => {
    try {
        chrome.alarms.create('refresh', { periodInMinutes: 3 })
        Store.set('autologin', null)
        Store.set('readNotifs', [])
        Store.set('unreadNotifs', [])
        await Store.restoreAll()
        const autologin = await Auth.login()
        Store.set('autologin', autologin)
        update()
    } catch (err) {
    }
}

const update = async () => {
    return new Promise((resolve, reject) => {
        if (!Store.get('autologin'))
            return reject('API token not set')
        Controller.getNotifications(Store.get('autologin'))
            .then(async (notifs) => {
                Store.set('unreadNotifs', notifs.filter(notif => {
                    return !Store.get('readNotifs').find(({ id }) => {
                        return id == notif.id
                    })
                }))
                if (Store.get('unreadNotifs').length > 0) {
                    chrome.browserAction.setBadgeBackgroundColor({
                        color: [255, 0, 0, 255]
                    })
                    chrome.browserAction.setBadgeText({
                        text: String(Store.get('readNotifs').length)
                    })
                } else {
                    chrome.browserAction.setBadgeText({
                        text: ''
                    })
                }
                await Store.saveAll()
                resolve()
            })
            .catch(reject)
    })
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
                    send({
                        ok: true, data: Store.get('readNotifs')
                            .concat(Store.get('unreadNotifs')) 
                    })
                })
                .catch(err => {
                    send({ ok: false, message: err.message })
                })
            break
        case 'readNotifications':
            Store.set('readNotifs', Store.get('readNotifs')
                .concat(Store.get('unreadNotifs')))
            Store.set('unreadNotifs', [])
            update()
            send({ ok: true })
            break
        case 'isLoggedIn':
            send({ ok: true, isLoggedIn: Boolean(Store.get('autologin')) })
            break
        case 'register':
            Auth.register(message.autologin)
                .then(() => {
                    Store.set('autologin', message.autologin)
                    send({ ok: true })
                })
                .catch(err => {
                    Store.set('autologin', null)
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
