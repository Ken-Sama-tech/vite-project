import child_process from 'child_process';
import {
    promisify
} from 'util';
import path from 'path';
import {
    fileURLToPath
} from 'url';

const __filename = fileURLToPath(
    import.meta.url)
const __dirname = path.dirname(__filename);

const exec = promisify(child_process.execFile);

const getInfo = async (url, cb = () => {}) => {
    try {
        const {
            stderr,
            error,
            stdout
        } = await exec('python', [path.join(__dirname, './get_info.py'), url])

        if (error)
            throw error;

        if (stderr)
            throw new Error(stderr);

        const result = stdout.toString();

        const res = {
            data: JSON.parse(result),
            message: "Successfully extracted source info",
            status: 200,
        }

        cb(res);
        return res;
    } catch (error) {
        const res = {
            error: true,
            message: error.message || error,
            status: 500
        }
        cb(res)
        return res
    }
}

export default getInfo