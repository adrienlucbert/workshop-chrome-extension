chrome.runtime.sendMessage({ type: 'getEvents' }, (res) => {
    if (!res.ok)
        throw res.message
    console.log(res.data)
})