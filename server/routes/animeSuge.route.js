import express from 'express'
import {
    search,
    getEps,
    getEpSrc
} from '../scraper/anime_suge/index.js'
import axios from 'axios';

const cleanupUrl = 'http://localhost:3000/cleanup/killzombies'

const router = express.Router();

router.get('/search', async (req, res) => {
    const {
        q = ""
    } = req.query;

    try {
        if (!q)
            throw new Error("Query cannot be empty")

        const response = await search(q)

        res.json(response)
    } catch (err) {
        res.status(500).json({
            error: true,
            message: err.message || err,
            status: 500
        })
    }
})

router.get('/eps', async (req, res) => {
    const {
        url = "",
            ep = null
    } = req.query;

    try {
        if (!url)
            throw new Error("Url cannot be empty")

        await axios.get(cleanupUrl)
        getEps(url, (response) => {
            const {
                data,
                error,
                message,
                status
            } = response;

            if (error) {
                res.json(response)
                return
            }

            if (Number(ep)) {
                let isValidEp = Number(ep) <= data.length

                const eps = data.map((d) => {
                    if (Number(d.ep) === Number(isValidEp ? ep : 1))
                        return d
                }).filter(Boolean)

                res.json({
                    data: eps,
                    eps: data,
                    status,
                    message
                })
            } else {
                res.json({
                    data,
                    status,
                    message
                })
            }

        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message || error,
            status: 500
        })
    }
})

router.get('/source', async (req, res) => {
    const {
        url = ""
    } = req.query;

    try {
        if (!url)
            throw new Error("Url cannot be empty")

        await axios.get(cleanupUrl)
        getEpSrc(url, response => {
            const {
                data,
                error,
                message,
                status
            } = response;

            if (error) {
                res.json(message)
                return;
            }

            res.json({
                data,
                status,
                message
            })
        })
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message || error,
            status: 500
        })
    }
})

export default router