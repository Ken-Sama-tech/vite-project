import child_process from 'child_process'
import util from 'node:util'

const exec = util.promisify(child_process.exec);
const controller = new AbortController();
const {
    signal
} = controller

async function killZombies() {
    try {
        const script_base = 'taskkill /F /IM'
        const exeFiles = ['edge.exe', 'python.exe', /*'node.exe'*/ ]
        const [python, chrome] = await new Promise.all(exeFiles.map(async (f) => {
            try {
                const {
                    stdout
                } = await exec(`${script_base} ${f}`, {
                    shell: true,
                    stdio: 'ignore'
                })
                return stdout
            } catch (err) {
                return null
            }
        }, {
            signal
        }))

    } catch (err) {
        console.warn("Zombie cleanup failed or not needed.");
        controller.abort()
        return "Zombie cleanup failed or not needed."
    }
}


export default killZombies