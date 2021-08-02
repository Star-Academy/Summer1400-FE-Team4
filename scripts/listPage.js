import { albums, singers } from './data.js';
import { likeIcon, addSongTable } from './functions.js';

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

const allMusics = albums.reduce(
    (s, c) => s.concat(c.songs.map((song) => ({ ...song, album: c }))),
    []
);

let query = '';
if ('query' in params) {
    query = params.query;
    document.getElementById('query').value = query;
}

const results = allMusics.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase())
);

addSongTable(results);
likeIcon();
