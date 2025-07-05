import axios from "axios";

class Cache {
    constructor({
        url = 'http://localhost:3000/cache/anime'
    } = {}) {
        this.baseUrl = url;
    }

    get = async (cb = () => {}) => {
        axios.get(this.baseUrl)
            .then(res => {
                cb({
                    status: 200,
                    data: res.data
                });
            })
            .catch(err => {
                cb({
                    error: true,
                    message: err.message || err,
                    status: err.status || 400
                });
            })
    }

    search = async (id, cb = () => {}) => {
        axios.get(`${this.baseUrl}/search?${id}`)
            .then(res => {
                cb({
                    status: 200,
                    data: res.data
                });
            })
            .catch(err => {
                cb({
                    error: true,
                    message: err.message || err,
                    status: err.status || 400
                });
            })
    }

    patch = (obj = {}, cb = () => {}) => {
        axios
            .patch(`${this.baseUrl}/update`, {
                ...obj
            })
            .then(res => {
                const data = res.data;
                cb({
                    message: 'update success',
                    status: 200,
                    data: data
                })
            }).catch(err => {
                cb({
                    error: true,
                    message: err.message || err,
                    status: err.status || 400
                });
            });
    }
}

export default Cache;
export const cache = new Cache();;