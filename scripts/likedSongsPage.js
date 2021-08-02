import { albums, singers } from './data.js';
import { likeIcon, addSongTable } from './functions.js';

const allMusics = albums
    .reduce(
        (s, c) => s.concat(c.songs.map((song) => ({ ...song, album: c }))),
        []
    )
    .filter((s) => s.isLiked);

const results = allMusics.filter((s) => s.isLiked);

addSongTable(results);
likeIcon();
