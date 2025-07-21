import axios from "axios";

class Cache {
    constructor({
        url = 'http://localhost:3000/cache/anime'
    } = {}) {
        this.baseUrl = url;
    }

    get = async (cb = () => {}) => {
        try {
            const response = await axios.get(this.baseUrl);
            const data = response.data;

            const res = {
                status: 200,
                data: data
            }

            cb(res);
            return res

        } catch (err) {
            const res = {
                error: true,
                message: err.message || err,
                status: err.status || 400
            }
            cb(res)
            return res
        }
    }

    search = async (id, cb = () => {}) => {
        try {
            const response = await axios.get(`${this.baseUrl}/search?id=${id}`)
            const data = response.data;

            const res = {
                status: 200,
                data: data
            }

            cb(res)
            return res
        } catch (err) {
            const res = {
                error: true,
                message: err.message || err,
                status: err.status || 400
            }
            cb(res)
            return res
        }
    }

    patch = async (obj = {}, cb = () => {}) => {
        try {
            const response = await axios.patch(`${this.baseUrl}/update`, {
                ...obj
            })
            const data = response.data;
            const res = {
                message: 'update success',
                status: 200,
                data: data
            }

            cb(res)
            return res
        } catch (err) {
            const res = {
                error: true,
                message: err.message || err,
                status: err.status || 400
            }
            cb(res)
            return res
        }
    }
}

export default Cache;
export const cache = new Cache();;