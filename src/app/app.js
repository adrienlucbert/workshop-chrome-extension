/**
 * Render notification item in #notifications-table element
 * 
 * @param {Object} notif notification object
 */
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

chrome.runtime.sendMessage({ type: 'getNotifications' }, (res) => {
    if (!res.ok)
        throw res.message
    res.data.forEach(notif => renderNotification(notif))
})

chrome.runtime.sendMessage({ type: 'readNotifications' }, (res) => {
    if (!res.ok)
        throw res.message
})