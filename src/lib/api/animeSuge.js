import axios from "axios"

class AnimeSuge {
    constructor() {
        this.baseUrl = "http://localhost:3000/api/animesuge"
        this.srcFrom = "animesuge"
        this.controller = new AbortController()
        this.signal = this.controller.signal
    }

    search = async (title, cb = () => {}) => {
        if (!title)
            return null
        try {
            const response = await axios.get(`${this.baseUrl}/search`, {
                params: {
                    q: title
                },
            });

            const {
                error,
                message
            } = response.data;

            if (error)
                throw new Error(message)

            cb(response.data)
            return response.data
        } catch (err) {
            const res = {
                error: true,
                message: err.message || err,
            }

            cb(res)
            return res
        }
    }

    getEps = async ({
        url,
        ep = ''
    }, cb = () => {}) => {
        try {
            const params = {
                url,
                ep
            }

            const response = await axios.get(`${this.baseUrl}/eps`, {
                params: {
                    ...params
                },
                signal: this.signal
            })
            const {
                message,
                error
            } = response.data;

            if (error) {
                cb(response.data)
                return response.data
            }

            cb(response.data)
            return response.data

        } catch (err) {
            if (axios.isCancel(err) || err.name === 'CancelledError') {
                console.log('child aborted lol')
                return
            }
            const res = {
                error: true,
                message: err.message || err,
            }
            cb(res)
            return res
        }
    }

    getEpSrc = async (url, cb = () => {}) => {
        try {
            const response = await axios.get(`${this.baseUrl}/source`, {
                params: {
                    url: url
                },
                signal: this.signal
            })
            const {
                message,
                error
            } = response.data
            if (error)
                throw new Error(message)

            cb(response.data)
            return response.data
        } catch (err) {
            if (axios.isCancel(err) || err.name === 'CancelledError') {
                console.log('child aborted lol')
                return
            }
            const res = {
                error: true,
                message: err.message || err,
            }
            cb(res)
            return res
        }
    }
}

const animeSuge = new AnimeSuge();
export default animeSuge;