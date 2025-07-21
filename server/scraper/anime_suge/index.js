import {
    spawn
} from 'child_process'
import axios from 'axios'
import * as cheerio from 'cheerio'
import {
    slugify
} from '../../../src/lib/utils/utils.js'
import filterMatches from '../../utils/filterMatches.util.js'
import path from 'path'
import {
    fileURLToPath
} from 'url'

const baseUrl = "https://animesugetv.se"
const __filename = fileURLToPath(
    import.meta.url)
const __dirname = path.dirname(__filename)

export const search = async (title, cb = () => {}) => {
    const regex = /^[a-zA-Z0-9]+([^\w\s][a-zA-Z0-9]+)+$/
    const isSlugified = regex.test(title)

    title = isSlugified ? slugify(title, {
        character: " "
    }) : title;

    const kw = isSlugified ? title : slugify(title, {
        character: "+"
    });

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
    } catch (error) {
        const res = {
            error: true,
            message: err.message || err,
            status: 500
        }
        cb(res)
        return res
    }
}

export const getEps = (url, cb = () => {}) => {
    const scraper = spawn('python', [path.join(__dirname, './get_eps.py'), url])

    let raw = ""
    let error = false
    let err_message = ""

    scraper.stdout.on('data', res => {
        const text = res.toString()
        raw += text
    })

    scraper.stderr.on('data', res => {
        error = true
        err_message += (res.toString() || "Failed to get episode list")
    })

    scraper.on('close', () => {
        try {
            if (!error) {

                const data = JSON.parse(raw)
                cb({
                    data: data,
                    status: 200,
                    message: "Json output: parsed successful"
                })
            } else {
                cb({
                    error: true,
                    message: raw,
                    status: 500
                })
            }
        } catch (err) {
            cb({
                error: true,
                status: 500,
                data: raw,
                message: err.message || err
            })
        }
    })
}

export const getEpSrc = (url, cb = () => {}) => {
    let src = "";
    let error = false
    let err_message = ""

    const scraper = spawn('python', [path.join(__dirname, './get_ep_src.py'), url]);

    scraper.stdout.on('data', res => {
        src = res.toString().trim()
    });

    scraper.stderr.on('data', res => {
        error = true
        err_message = res.toString()
    })

    scraper.on('close', () => {
        if (!error) {
            cb({
                data: {
                    src
                },
                message: "Succesfully extracted src",
                status: 200,
            })
        } else {
            cb({
                error: true,
                message: err_message,
                status: 500
            })
        }
    });
}