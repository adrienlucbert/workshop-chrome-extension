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

    static fetch(autologin, url, options = {}) {
        if (options.method === undefined) {
            options.method = 'GET'
        }
        const target = this.formatURL(autologin, url)
        return fetch(target, options)
            .then(res => {
                if (!res.ok)
                    throw new Error(res.statusText)
                return res.json()
            })
    }
}

export default ApiRequester