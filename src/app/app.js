import sendMessagePromise from './sendMessagePromise.js'

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

const init = () => {
    update()
}

const update = async () => {
    const notificationsTable = document.querySelector('#notifications-table')
    const registerForm = document.querySelector('#register-form')

    let isLoggedIn = false

    notificationsTable.classList.remove('active')
    registerForm.classList.remove('active')

    await sendMessagePromise({ type: 'isLoggedIn' })
        .then(response => isLoggedIn = response.isLoggedIn)
        .catch(console.error)

    if (isLoggedIn) {
        notificationsTable.classList.add('active')
    } else {
        registerForm.classList.add('active')
        registerForm.onsubmit = (e) => {
            e.preventDefault()
            const autologin = registerForm.autologin.value
            sendMessagePromise({ type: 'register', autologin: autologin })
                .then(update)
                .catch(console.error)
        }
    }

    sendMessagePromise({ type: 'getNotifications' })
        .then(res => {
            res.data.forEach(notif => renderNotification(notif))
        })
        .catch(console.error)

    sendMessagePromise({ type: 'readNotifications' })
        .catch(console.error)
}

init()