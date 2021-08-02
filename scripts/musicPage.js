import { albums } from './data.js';

const musicHTML = albums.reduce(
    (s, c) => s.concat(c.songs.map((song) => ({ ...song, album: c }))),
    []
);
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
let music = musicHTML.filter((song) => song.name === params.name);
const image = document.getElementById('image');
const songName1 = document.getElementById('songName1');
const albumName = document.getElementById('albumName');
const singerName = document.getElementById('singerName');
const liked = document.getElementById('liked');
const notLiked = document.getElementById('notLiked');
const songLyrics = document.getElementById('songLyrics');

if (music.length < 1) {
    location.replace('index.html');
} else {
    music = music[0];
    image.src = music.album.imageAddress;
    songName1.innerText = music.name;
    albumName.innerText = music.album.name;
    singerName.innerText = music.album.singer;
    songLyrics.innerText = music.lyrics;
    if (music.isliked) {
        notliked.style.display = 'none';
    } else {
        liked.style.display = 'none';
    }

    document.getElementById('songName').innerText = music.name;
    document.getElementById('songDuration').innerText = music.duration;
}
