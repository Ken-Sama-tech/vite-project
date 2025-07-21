import express from 'express';
import path from "path";
import FsUtil from "../utils/fs.util.js";
import {
    fileURLToPath
} from "url";

const __filename = fileURLToPath(
    import.meta.url)
const __dirname = path.dirname(__filename)

const cachePath = path.resolve(__dirname, '../data/localAnimeCache.json');
const cacheTemplate = {
    id: null,
    title: "",
    alternative: [],
    imageUrl: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/default.jpg",
    "bookmarked": false,
    "type": "anime",
    "episodesWatched": [],
    "lastEpisodeWatched": null,
    "finishedLastEpisode": false,
    "viewed": false
}

const fsUtil = new FsUtil({
    template: cacheTemplate,
    path: cachePath
});

const router = express.Router();

router.get('/', (_, res) => {
    fsUtil.read(response => {
        const {
            error,
            data
        } = response;

        if (error) {
            res.json(response);
        } else {
            res.json(data);
        }
    })
});

router.get('/search', (req, res) => {
    const id = parseInt(req.query.id);
    fsUtil.search(id, response => {
        const {
            error,
            data,
        } = response;

        if (error) {
            res.json(response)
        } else {
            res.json(data)
        }
    })
});

router.patch('/update', (req, res) => {
    const {
        id = parseInt(id || 0),
            ...fields
    } = req.body;

    if (!id) {
        res.json({
            error: true,
            message: 'Missing ID',
            status: 404
        });
    } else {
        fsUtil.search(id, result => {
            const {
                data
            } = result;
            if (data.length <= 0) {
                fsUtil.add({
                    ...fields,
                    id: id
                }, response => {
                    res.json(response)
                });
            } else {
                fsUtil.update({
                    id: id,
                    ...fields
                }, response => {
                    res.json(response)
                })
            }
        })
    }
})


export default router;