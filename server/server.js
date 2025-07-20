import express from 'express';
import anilistRouter from './routes/anilist.route.js';
import cacheRouter from './routes/animeCache.route.js';
import settingsRouter from './routes/settings.route.js';

import {
    fileURLToPath
} from 'url';
import path from 'path';
import cors from 'cors';

const app = express();
app.use(cors());
const PORT = 3000;
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use('/api/anilist', anilistRouter);
app.use('/cache/anime', cacheRouter);
app.use('/settings', settingsRouter);

app.listen(PORT, () => {
    console.log(`listening at port ${PORT}`);
})