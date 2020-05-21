class DateFormatter {
    /**
     * Format a data to comply with intranet format (YYYY-MM-DD)
     * 
     * @param {Date} date date to format
     */
    static formatDate(date) {
        const addPadding = (string, padding, padder = '0') => {
            const paddedStr = padder.repeat(padding) + string
            return paddedStr.slice(-Math.max(padding, String(string).length))
        }

        const year = addPadding(date.getFullYear(), 4, '0')
        const month = addPadding(date.getMonth() + 1, 2, '0')
        const day = addPadding(date.getDate(), 2, '0')

        return `${year}-${month}-${day}`
    }
    /**
     * Returns a date <daysShift> days from now, to the format "YYYY-MM-DD"
     * 
     * @param {Number} daysShift days to add to current date
     */
    static getDate(daysShift = 0) {
        const msPerDay = 1000 * 60 * 60 * 24
        const date = new Date(new Date().getTime() + msPerDay * daysShift)

        return (this.formatDate(date))
    }
}

export default DateFormatter