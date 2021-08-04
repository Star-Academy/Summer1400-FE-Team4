import { albums, singers } from './data.js';
import { likeIcon, addSongTable } from './functions.js';

const allMusics = albums.reduce(
    (sum, current) => sum.concat(current.songs.map((song) => ({ ...song, album: current }))),
    []
);

const results = allMusics.filter((song) => song.isLiked);

addSongTable(results);
likeIcon();
