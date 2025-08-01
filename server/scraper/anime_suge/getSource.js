import axios from 'axios';

const headers = {
    "Referer": "https://megaplay.buzz/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv.0) Gecko/20100101 Firefox/124.0",
    "X-Requested-With": "XMLHttpRequest",
    "Accept": "application/json",
}

const url = "https://megaplay.buzz/stream/getSources";

const getSource = async (id, cb = () => {}) => {
    try {
        const response = await axios.get(url, {
            params: {
                id
            },
            headers
        })

        const {
            sources,
            tracks
        } = response.data;

        const m3u8 = sources.file

        const file2 = await axios.get(m3u8, {
            headers
        });

        const hasFile2 = file2.data.trim().includes("index-f1")
        const index = m3u8.indexOf("master");

        const result = {
            status: 200,
            message: "Successfully extracted source",
            data: {
                sources: {
                    ...sources,
                    file2: hasFile2 ? m3u8.slice(0, index) + "index-f1-v1-a1.m3u8" : ''
                },
                tracks
            }
        }
        console.log(result)
        cb(result)
        return result
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

export default getSource;