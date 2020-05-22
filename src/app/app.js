chrome.runtime.sendMessage({ type: 'getNotifications' }, (res) => {
    if (!res.ok)
        throw res.message
    console.log(res.data)
})

chrome.runtime.sendMessage({ type: 'readNotifications' }, (res) => {
    if (!res.ok)
        throw res.message
})