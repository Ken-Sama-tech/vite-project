export const slugify = (string, {
    casing = 'lower',
    character = '-'
} = {}) => {
    if (!string) return;

    switch (casing) {
        case "lower":
            string = string.toLowerCase();
            break;
        case "upper":
            string = string.toUpperCase();
            break;
        default:
            return string
    }
    return string.replace(/[^a-zA-Z0-9 ]/g, '').replace(/ /g, character);
}

export const formatDate = (date = {}) => {
    const {
        day = null, month = null, year = null
    } = date;

    if (!day && !month && !year)
        return ''

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const newDate = [`${months[month - 1]} ${day || ''}`, year]

    const formattedDate = newDate.map(d => d).filter(Boolean).join(', ')

    return formattedDate;
}

export const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000)
    console.log(date)
}