import axios from "axios";
import anilistQueryBuilder from "../utils/anilistQueryBuilder";

class Anilist {
    constructor() {
        // this.api = 'api/anilist/anime'
        this.api = `http://localhost:3000/api/anilist`
    }

    /**
     * Get anime data from the Anilist API
     * @param {string} name - The name of the anime to search for. Can be an array of names.
     * @param {Array} data - The fields to retrieve for the anime. Can include fields like 'id', 'title', 'coverImage', etc.
     * @param {Object} mediaParams - Additional parameters for media filtering, such as sorting options.
     * @param {number} page - The page number for pagination. Default is 1.
     * @param {number} limit - The number of results to return per page. Default is 10.
     * @param {*} params
     * @param {*} cb
     * @returns
     * 
     * @example
     * anilist.getAnime({
     *   name: ['Naruto'],
     *   data: ['id', {title: ['english', 'romaji', 'native']}],
     *   mediaParams: { status: 'RELEASING' },
     *   page: 1,
     *   limit: 10
     * });
     */

    getAnime = async (params = {}, cb = () => {}) => {
        // const {
        //     name = [], data = [], mediaParams = {}, page = 1, limit = 0, pageInfo = false
        // } = params;

        const query = anilistQueryBuilder(params);

        try {
            const url = `${this.api}/anime?${query}`;

            const response = await axios.get(url)

            const {
                error,
                data
            } = response.data;

            if (error)
                throw new Error(error);

            cb({
                error: false,
                message: 'success',
                status: 200,
                data: data
            })

        } catch (err) {
            cb({
                error: true,
                message: err.message || 'unknown error',
                status: err.status || 400,
                data: null
            })
        }
    }

    getGenreCollection = async (cb = () => {}) => {
        const url = `${this.api}/anime/genres`;
        try {
            const response = await axios.get(url);
            const data = response.data.data;

            cb({
                message: 'fetch success',
                status: 200,
                data: data
            })
        } catch (err) {
            cb({
                error: true,
                message: err.message || err,
                status: err.status || 400
            })
        }
    }
}

const anilist = new Anilist;
export default anilist;