import { ApiError, apiGet, apiPost, Page, Song } from './page.js';

const page = new Page();

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

async function getSongs() {
    const results = (
        await apiPost('song/find', {
            phrase: params.name,
            count: 100,
            sorter: 'name',
            desc: true,
        })
    ).songs;

    return results.filter((song) => song.artist.search(params.name) > -1);
}

async function updateSongs() {
    const songs = await getSongs();

    if (songs.length === 0) {
        alert('خواننده وجود ندارد!');
        return;
    }

    document.getElementById('image').src = songs[songs.length - 1].cover;
    document.getElementById('singerName').innerText = songs[songs.length - 1].artist;
    document.getElementById('albumCount').innerText =
        songs.length.toLocaleString('fa-IR') + ' آلبوم';

    const songRenders = songs.map((song) => {
        return new Song(song, null, true, true, true);
    });

    for (const songRender of songRenders)
        document.getElementById('albumShelf').innerHTML += songRender.albumCard;

    if (songRenders.length === 0)
        document.getElementById('songTableEmpty').classList.remove('hidden');
}

try {
    page.updatePage();
    page.updateTitle(params.name);

    await updateSongs();
} catch (error) {
    if (error instanceof ApiError) alert(error.message);
    throw error;
}
