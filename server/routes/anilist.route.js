import axios from 'axios';
import express from 'express';
import anilistQueryBuilder from '../utils/anilistQueryBuilder.util.js';

const router = express.Router();
const baseUrl = 'https://graphql.anilist.co';

router.get('/anime', async (req, res) => {
    const {
        // name = [], data = [], mediaParams = '', limit = 10, page = 1
        mediaParams = '',
            ...args
    } = req.query;

    try {
        const query = await anilistQueryBuilder({
            ...args,
            mediaParams: `${mediaParams ? `type: ANIME, ${mediaParams}`: 'type: ANIME'}}`
        });

        const response = await axios.post(baseUrl, {
            query: query
        });

        res.json(response.data)
    } catch (err) {
        res.status(500).json(err)
    }
});

router.get('/anime/genres', async (_, res) => {
    try {
        const response = await axios.post(baseUrl, {
            query: `query {GenreCollection}`
        });

        res.json(response.data)
    } catch (err) {
        res.status(500).json(err);
    }
});

export default router;