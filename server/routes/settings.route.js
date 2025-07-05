import express from 'express';
import FsUtil from '../utils/fs.util.js';
import path from 'path';
import {
    fileURLToPath
} from 'url';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
const settingsPath = path.resolve(__dirname, '../public/data/settings.json');

const fsUtil = new FsUtil({
    path: settingsPath,
    template: {}
});

const router = express.Router();

router.get('/', (_, res) => {
    fsUtil.read(response => {
        res.json(response.data);
    });
});

router.patch('/update', async (req, res) => {
    const {
        ...fields
    } = req.body;

    fsUtil.read(response => {
        const {
            data,
            error
        } = response;

        if (error) {
            res.status(500).json(response)
            return;
        }

        const updatedFields = {
            ...data,
            ...fields
        }

        fsUtil.write(updatedFields, () => {
            res.json({
                message: 'Update success',
                status: 200
            })
        });
    })
});

export default router;