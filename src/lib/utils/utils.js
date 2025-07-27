export const slugify = (string, options = {}) => {
    const {
        casing = 'lower',
            character = '-'
    } = options;

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
    return string.replace(/[^a-zA-Z0-9 ]/g, ' ').split(' ').filter(Boolean).join(' ').replace(/ /g, character);
}

export const formatDate = (date = {}) => {
    const {
        day = null, month = null, year = null
    } = date;

    if (!day && !month && !year)
        return ''

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const newDate = [`${months[month - 1] || ''} ${day || ''}`, String(year)]

    const formattedDate = newDate.map(d => d.trim()).filter(Boolean).join(', ')

    return formattedDate;
}

export const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);

    const pad = (n) => String(n).padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());

    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const formatArrToString = (arr = [], property, char = ', ') => {
    if (!arr || !property)
        return ''

    const string = arr.map((item) => String(item[property]).trim()).filter(Boolean).join(char)

    return string;
}

export const insertAt = (str, index, insert) => {
    return str.slice(0, index) + insert + str.slice(index)
}

export const splitIntoChunks = (iterable, incBy = 1) => {
    const chunks = []
    for (let i = 0; i < iterable.length - 1; i += incBy) {
        chunks.push(iterable.slice(i, i + incBy))
    }

    return chunks
}