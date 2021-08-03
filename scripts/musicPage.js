import { ApiError, apiGet, Page } from './page.js';

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

try {
    const song = (await apiGet('song/one/' + params.id)).song;

    document.getElementById('image').src = song.cover;
    document.getElementById('songName').innerText = song.name;
    document.getElementById('songNameInList').innerText = song.name;
    document.getElementById('albumName').innerText = 'تک آهنگ';
    document.getElementById('albumName').href = 'album.html?id=' + song.id;
    document.getElementById('singerName').innerText = song.artist;
    document.getElementById('singerName').href = 'artist.html?name=' + song.artist;
    document.getElementById('songLyrics').innerText = song.lyrics;
    document.getElementById('likeButton').setAttribute('data-id', song.id);
    document.getElementById('dislikeButton').setAttribute('data-id', song.id);

    const page = new Page();

    const likedSongs = await page.getLikedSongs();
    const liked = likedSongs.find((likedSong) => likedSong.id === song.id) !== undefined;
    if (liked) {
        document.getElementById('dislikeButton').classList.remove('hidden');
        document.getElementById('likeButton').classList.add('hidden');
    }

    page.registerLikeButtons();
} catch (error) {
    if (error instanceof ApiError) alert(error.message);
    throw error;
}
