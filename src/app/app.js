import sendMessagePromise from './sendMessagePromise.js'

const renderNotification = (notif) => {
    const table = document.querySelector('#notifications-table')

    if (!notif || !notif.title)
        return
    const tr = document.createElement('tr')
    const td = document.createElement('td')
    tr.appendChild(td)
    td.innerHTML = notif.title
    table.appendChild(tr)
}

sendMessagePromise({ type: 'getNotifications' })
    .then(response => {
        for (let notif of response.notifs)
            renderNotification(notif)
    })
    .catch(console.error)

sendMessagePromise({ type: 'readNotifications' })