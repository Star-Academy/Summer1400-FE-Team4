import { ApiError, apiGet, apiPost, Page, Song } from './page.js';

const page = new Page();

async function getSongs(current = 1) {
    return (
        await apiPost('song/page', {
            size: 20,
            current: current,
            sorter: 'name',
            desc: true,
        })
    ).songs;
}

async function updateSongs() {
    const songs = await getSongs(1);

    const songRenders = songs.map((song) => {
        return new Song(song, null, true, true, true);
    });

    for (const songRender of songRenders)
        document.getElementById('albumShelf').innerHTML += songRender.albumCard;
}

async function updateArtists() {
    const songs = await getSongs(2);

    const songRenders = songs.map((song) => {
        return new Song(song, null, true, true, true);
    });

    for (const songRender of songRenders)
        document.getElementById('singerShelf').innerHTML += songRender.artistCard;
}

try {
    page.updatePage();

    updateSongs();
    updateArtists();
} catch (error) {
    if (error instanceof ApiError) alert(error.message);
    throw error;
}
