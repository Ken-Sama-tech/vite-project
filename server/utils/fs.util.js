import fs from 'fs';

class FsUtil {
    constructor({
        path,
        template = {}
    }) {
        this.path = path;
        this.template = template
    }

    read = (cb = () => {}) => {
        fs.readFile(this.path, 'utf-8', (err, res) => {
            if (err) {
                const result = {
                    error: true,
                    message: err
                }
                cb(result)
            } else {
                const result = {
                    success: true,
                    data: !res || res.length <= 0 ? [] : JSON.parse(res),
                }
                cb(result)
            }
        })
    }

    write = (obj, cb = () => {}) => {
        const newObject = typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2);

        fs.writeFile(this.path, newObject, err => {
            if (err) {
                console.log(err)
                cb({
                    error: true,
                    message: err
                })
            } else {
                cb({
                    success: true,
                    message: 'File succesfully written',
                })
            }
        })
    }

    add = (newEntry, cb = () => {}) => {
        this.read(res => {
            const {
                error,
                data
            } = res
            if (error)
                cb(res)
            else {
                const fullEntry = {
                    ...this.template,
                    ...newEntry
                }
                data.push(fullEntry);
                this.write(data, res => cb(res))
            }
        })
    }

    update = (updatedFields, cb = () => {}) => {
        const {
            id,
            ...args
        } = updatedFields;
        this.read(res => {
            const {
                data,
                error
            } = res;
            const idx = data.findIndex(item => item.id === id)

            if (idx === -1) {
                cb({
                    error: true,
                    message: `Cannot update anime with id:${id} because it doesnt exist on local cache`
                })
            } else {
                if (error)
                    cb(res);
                else {
                    data[idx] = {
                        ...this.template,
                        ...data[idx],
                        ...args
                    }
                    this.write(data, res => cb(res))
                }
            }
        })
    }

    remove = (id, cb = () => {}) => {
        this.read(res => {
            const {
                data,
                error
            } = res;

            if (error)
                cb(res)
            else {
                const updatedData = data.filter(item => item.id !== id);
                this.write(updatedData)
            }
        });
    }

    search = (id = 0, cb = () => {}) => {
        this.read(res => {
            const {
                data,
                error
            } = res;

            if (error) {
                cb(res)
            } else {
                const result = data.filter(item => item.id === id);
                console.log(data)
                cb({
                    success: true,
                    message: result.length <= 0 ? 'No result found' : 'result found',
                    data: result
                })

            }
        })
    }
}

export default FsUtil;