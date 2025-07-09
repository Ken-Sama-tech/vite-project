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
    const newData = data.map((n) => {
        if (typeof n == 'object') {
            const string = JSON.stringify(n)
                .replace(/[{}:"]/g, '')
                .replace('[', '{')
                .replace(']', '}')
                .replace(/,/g, ' ')

            return `data=${string}`;
        } else {
            return `data=${n}`;
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