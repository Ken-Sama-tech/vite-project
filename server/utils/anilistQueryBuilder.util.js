import axios from "axios";
const settingsUrl = 'http://localhost:3000/settings';

const anilistQueryBuilder = async ({
    name = [],
    data = [],
    mediaParams = '',
    limit = 10,
    page = 1,
    pageInfo = false
}) => {
    let tempQuery = '';

    const settings = await axios.get(settingsUrl);
    const content = settings.data.content.active;

    let filter;

    if (content === 'NSFW') {
        filter = 'isAdult: true'
    } else if (content == 'SFW') {
        filter = 'isAdult: false'
    }

    const params = mediaParams ? mediaParams.replace(/["{}]/g, '').replace(/,/g, ', ').replace(/'/g, '"') : null;

    const newData = Array.isArray(data) ? data.join(' ') : data;

    const isNameProvided = () => {
        const names = Array.isArray(name) ? name : [name];
        return names.map((name) => {
            return `${name.replace(/ /g, '_')}: Media( search:"${name}", ${params} ${filter ? `,${filter}` : ''}){${newData}}`;
        });
    }

    const isPageInfoBool = pageInfo === 'true' ? true : false;
    const pInfoQuery = 'pageInfo {total currentPage lastPage hasNextPage perPage}';

    const media = name.length ? isNameProvided() : `media(${params} ${filter ? `,${filter}` :''}){${newData}}`;

    tempQuery += !name.length ? `query {Page (page: ${page}, perPage: ${limit}) { ${isPageInfoBool ? pInfoQuery : ''} ${media}}}` : `query {${media} }`;

    return tempQuery;
}

export default anilistQueryBuilder;