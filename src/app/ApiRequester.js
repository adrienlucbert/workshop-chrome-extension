/**
 * Epitech's intranet API requester
 */
class ApiRequester {
    /**
     * Format an URL API-ready from autologin and url
     * 
     * @param {String} autologin intranet autologin link
     * @param {String} url target url
     * @return {String}
     */
    static formatURL(autologin, url) {
        url = `${autologin}/${url}`
        let params = new URLSearchParams(new URL(url).search.slice(1))
        params.append('format', 'json')
        url = `${url}?${params.toString()}`
        return url
    }
    /**
     * Fetch intranet API
     * 
     * @param {String} autologin intranet autologin link
     * @param {String} url target url
     * @param {Object} options fetch options
     */
    static fetch(autologin, url, options = {}) {
        if (options.method === undefined) {
            options.method = 'GET'
        }
        url = this.formatURL(autologin, url)
        return fetch(url, options)
            .then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    throw new Error(res.statusText)
                }
            })
    }
}

export default ApiRequester