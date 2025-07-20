import Fuse from "fuse.js"

const filterMatches = (choices = [], options = {}) => {
    const {
        keys = ['title'], threshold = 0.2, query = ""
    } = options

    const fuse = new Fuse(choices, {
        includeScore: true,
        keys: keys,
        threshold: threshold,
    });

    const result = fuse.search(query).map(r => r.item)
    return result
}

export default filterMatches