chrome.runtime.sendMessage({ type: 'getNotifications' }, response => {
    console.log(response)
})