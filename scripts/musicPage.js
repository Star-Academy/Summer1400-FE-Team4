import { ApiError, apiGet, Page, Song } from './page.js';

const page = new Page();

async function getSong() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    return (await apiGet('song/one/' + params.id)).song;
}

async function updateSong() {
    const [song, likedSongs] = await Promise.all([getSong(), page.getLikedSongs()]);

    document.getElementById('image').src = song.cover;
    document.getElementById('songName').innerText = song.name;
    document.getElementById('albumName').innerText = 'تک آهنگ';
    document.getElementById('albumName').href = 'album.html?id=' + song.id;
    document.getElementById('singerName').innerText = song.artist;
    document.getElementById('singerName').href = 'artist.html?name=' + song.artist;
    document.getElementById('songLyrics').innerText = song.lyrics;

    const liked = likedSongs.find((likedSong) => likedSong.id === song.id) !== undefined;
    const songRender = new Song(song, liked, false, false, false);
    document.getElementById('songTable').innerHTML += songRender.listItem;
}

try {
    page.updatePage();

    await updateSong();
    page.updateList();
} catch (error) {
    if (error instanceof ApiError) alert(error.message);
    throw error;
}
