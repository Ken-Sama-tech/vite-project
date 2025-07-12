class LocalStorage {
    get({
        key
    }, cb = () => {}) {
        try {
            if (!key) {
                throw new Error('Key cannot be empty')
            }

            const item = localStorage.getItem(key);

            if (!item) {
                console.log(`Can't find items with key "${key}"`)
            }

            const data = JSON.parse(item) || null
            const res = {
                data: data,
                message: "success",
            }

            cb(res)
            return res
        } catch (err) {
            const res = {
                error: true,
                message: err.message || err
            }
            cb(res)
            return res
        }
    }

    set({
        key,
        value
    }, cb = () => {}) {
        try {
            if (!key || !value) {
                throw new Error('Key or Value cannot be empty')
            }

            const obj = JSON.stringify(value);
            localStorage.setItem(key, obj)

            const res = {
                message: "success",
            }

            cb(res)
            return res
        } catch (err) {
            const res = {
                error: true,
                message: err.message || err
            }
            cb(res)
            return res
        }
    }

    remove({
        key
    }, cb = () => {}) {
        try {
            if (!key)
                throw new Error('Key cannot be empty');

            localStorage.removeItem(key);
            const res = {
                message: "success",
            }
            cb(res)
            return res
        } catch (err) {
            const res = {
                message: err.message || err,
                error: true,
            }
            cb(res)
            return res
        }
    }
}

const ls = new LocalStorage();
export default ls;