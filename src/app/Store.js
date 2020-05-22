/**
 * Store class
 */
class Store {
    static props = {}

    /**
     * Set a property value in store
     * 
     * @param {String} name property name
     * @param {any} value property value
     */
    static set(name, value) {
        this.props[name] = value
    }

    /**
     * Get a property value from store
     * 
     * @param {String} name property name
     */
    static get(name) {
        return this.props[name]
    }

    /**
     * Save a property to local storage
     * 
     * @param {String} name property name
     */
    static saveOne(name) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.set({ name: this.props[name] }, () => {
                if (chrome.runtime.lastError)
                    return reject(chrome.runtime.lastError.message)
                resolve()
            })
        })
    }
    /**
     * Save store to local storage
     */
    static saveAll() {
        return new Promise((resolve, reject) => {
            const promises = []
            for (const name in this.props) {
                promises.push(this.saveOne(name))
            }
            console.log('Save ', this.props)
            Promise.all(promises)
                .then(resolve)
                .catch(reject)
        })
    }

    /**
     * Retrieve a property from local storage
     * @param {String} name property name
     */
    static restoreOne(name) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get([name], props => {
                if (chrome.runtime.lastError)
                    return reject(chrome.runtime.lastError.message)
                this.set(name, props[name] || this.props[name])
                resolve(props[name])
            })
        })
    }
    /**
     * Retrieve store properties from local storage
     */
    static restoreAll() {
        return new Promise((resolve, reject) => {
            const promises = []
            for (const name in this.props) {
                promises.push(this.restoreOne(name))
            }
            Promise.all(promises)
                .then(() => {
                    console.log('Restore ', this.props)
                    resolve()
                })
                .catch(reject)
        })
    }
}

export default Store