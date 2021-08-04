import { albums } from './data.js';
import { likeIcon, addSongTable } from './functions.js';

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

const allMusics = albums.reduce(
    (sum, current) => sum.concat(current.songs.map((song) => ({ ...song, album: current }))),
    []
);

let query = '';
if ('query' in params) {
    query = params.query;
    document.getElementById('query').value = query;
}

const results = allMusics.filter((music) => music.name.toLowerCase().includes(query.toLowerCase()));

addSongTable(results);
likeIcon();
