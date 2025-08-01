import axios from 'axios';
import * as cherrio from 'cheerio';

const getID = async (url, cb = () => {}) => {
    try {
        const response = await axios.get(url, {
            headers: {
                'Referer': 'https://megaplay.buzz/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv.0) Gecko/20100101 Firefox/124.0'
            }
        })

        const data = response.data;

        const $ = cherrio.load(data)
        const title = $('title').text()
        const reg = /^\d+$/;
        const id = title.split(' ').filter(t => (reg.test(t))).join()
        const res = {
            data: {
                id: Number(id)
            },
            message: "Successfully extracted the id",
            status: 200
        }
        console.log(res)
        cb(res)
        return res
    } catch (error) {
        const res = {
            error: true,
            message: error.message || error,
            status: 500
        }

        cb(res);
        return res;
    }
}
export default getID;