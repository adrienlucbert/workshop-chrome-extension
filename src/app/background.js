import Controller from './Controller.js'

let autologin = null
let events = []

const init = () => {
    autologin = "[place your autologin link here]"
    chrome.alarms.create('refresh', { periodInMinutes: 3 })
    update()
}

const update = async () => {
    events = await Controller.getUpcomingEvents(autologin)
}

chrome.runtime.onInstalled.addListener(init)

chrome.runtime.onMessage.addListener((message, from, send) => {
    switch (message.type) {
        case 'getEvents':
            send({ ok: true, data: events })
            break;
        default:
            send({ ok: false, message: 'Unknown request' })
            break;
    }
})

chrome.alarms.onAlarm.addListener(update)
