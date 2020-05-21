import Controller from './Controller.js'
import Store from './Store.js'

Store.autologin = "[place your autologin link here]"

Controller.getUpcomingEvents()
    .then(console.log)
    .catch(console.error)