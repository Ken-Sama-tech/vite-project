import * as cheerio from 'cheerio';
import axios from 'axios';
import {
    slugify
} from '../../../src/lib/utils/utils.js';
import filterMatches from '../../utils/filterMatches.util.js';


const baseUrl = "https://animesugetv.se";

export const search = async (title, cb = () => {}) => {
    const kw = slugify(title, {
        character: "+"
    })
    try {
        const response = await axios.get(`${baseUrl}/filter?keyword=${kw}`, {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9"
        })

        const raw = response.data;
        const $ = cheerio.load(raw)
        const container = $(raw).find("div.original.anime.main-card")
        const items = $(container).children('div.item')
        const data = []

        $(items).each((_, node) => {
            const a = $(node).find('*[data-jp]');
            const url = $(a).attr('href');
            const title = $(a).text().trim();
            const romaji = $(a).attr('data-jp')
            data.push({
                title,
                url,
                romaji
            });
        })

        const result = filterMatches(data, {
            query: title,
            threshold: 0.2,
            keys: ['title', 'romaji']
        });


        if (!result.length) {
            const res = {
                message: "No results found",
                data: [],
                status: 200,
            }

            cb(res)
            return res
        }

        const res = {
            data: result,
            message: "Result found",
            status: 200
        }

        cb(res)
        return res
    } catch (err) {
        const res = {
            error: true,
            message: err.message || err,
            status: 500
        }
        cb(res)
        return res
    }
}

export default search