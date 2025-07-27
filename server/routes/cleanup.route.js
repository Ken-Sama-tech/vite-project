import express from 'express'
import killZombies from '../scraper/utils/killZombies.js';

const router = express.Router();

router.get('/killzombies', async (req, res) => {
    res.json(await killZombies())
})

export default router;