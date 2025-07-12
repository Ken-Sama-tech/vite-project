import axios from "axios";

class Settings {
    constructor() {
        this.url = "http://localhost:3000/settings"
    }

    get = async (name, cb = () => {}) => {
        try {
            const response = await axios.get(this.url)
            const data = name ? response.data[name] : response.data;

            if (!data && name) {
                throw new Error(`Can't find an option in the settings with name "${name}"`)
            }

            const res = {
                status: 200,
                message: 'fetch success',
                data: data
            }

            cb(res);
            return res
        } catch (err) {
            const res = {
                error: true,
                status: err.status || 400,
                message: err.message || err
            }

            cb(res)
            return res
        }

    }

    patch = async ({
        ...fields
    }, cb = () => {}) => {
        try {
            const response = await axios.patch(`${this.url}/update`, {
                ...fields
            });

            const {
                ...res
            } = response.data;

            cb({
                ...res
            })

            return {
                ...res
            }
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

const settings = new Settings;
export default settings