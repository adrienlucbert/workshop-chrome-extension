import ApiRequester from './ApiRequester.js'
import DateFormatter from './DateFormatter.js'
import Store from './Store.js'

/**
 * Application controller
 */
class Controller {
    /**
     * List upcoming events the user is registered to withing to next 
     * <daysInterval> days
     * 
     * @param {Number} daysInterval interval of days from today to fetch events
     */
    static getUpcomingEvents(daysInterval = 7) {
        return new Promise(async (resolve, reject) => {
            const start = DateFormatter.getDate()
            const end = DateFormatter.getDate(daysInterval)
            const url = `/planning/load?start=${start}&end=${end}`
            let events = null
            try {
                events = await ApiRequester.fetch(Store.autologin, url)
            } catch (err) {
                reject(err)
            }
            events = events.filter(event => event.event_registered)
            resolve(events);
        })
    }
}

export default Controller