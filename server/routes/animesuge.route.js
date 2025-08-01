import express from 'express';
import {
    getInfo
} from '../scraper/anime_suge/index.js';

const router = express.Router();

router.get('/test', async (req, res) => {
    const {
        url
    } = req.query;
    const response = await getInfo(url)
    res.send(response)
})

export default router;