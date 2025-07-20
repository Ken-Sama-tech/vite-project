import {
    insertAt
} from "./utils";

const anilistQueryBuilder = (params) => {
    const {
        name = [], data = [], mediaParams = {}, page = 1, limit = 0, pageInfo = false
    } = params;

    if (!data.length) {
        console.error(`data[] cannot be empty. Provide atleast 1 argument`);
        return;
    }

    let tempQuery = '';
    const media = JSON.stringify(mediaParams)
    const newData = data.map((d) => {
        if (typeof d == 'object') {

            const {
                params,
                ...rest
            } = d;

            let string = JSON.stringify(rest)
                .replace(/[{}:"]/g, '')
                .replace(/\[/g, '{')
                .replace(/\]/g, '}')
                .replace(/,/g, ' ')

            if (params) {
                const keys = Object.keys(params)
                const values = Object.values(params)

                keys.map((key, idx) => {
                    const propKey = Object.keys(values[idx])[0]
                    const propVal = Object.values(values[idx])
                    const index = string.indexOf(key) + key.length
                    const insert = `(${propKey}: ${propVal})`
                    string = insertAt(string, index, insert);
                })
            }

            return `data=${string}`;
        } else {
            return `data=${d}`;
        }
    });

    tempQuery += name.length ? `${name.map((n) => {
                return `name=${n}`;
            })}&${newData}` : newData;

    limit ? typeof limit == 'number' ? tempQuery += `&limit=${limit}&page=${page}` : console.warn('Invalid limit value. Limit should only be a number') : '';

    tempQuery += `&mediaParams=${encodeURIComponent(media)}${pageInfo ? '&pageInfo=true': ''}`;

    tempQuery = tempQuery.replace(/,/g, '&');

    return tempQuery;
}

export default anilistQueryBuilder;