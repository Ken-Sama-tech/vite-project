const getCacheUrl = (type) => {
    const baseUrl = 'http://localhost:3000';

    const allowedTypes = ['anime', 'manga', 'novel'];

    if (!allowedTypes.includes(type)) {
        console.warn(`"${type} is not a valid type. Therefore using the default type"`)
        return `${baseUrl}/cache/anime`
    }

    return `${baseUrl}/cache/${type}`;
}

export default getCacheUrl;