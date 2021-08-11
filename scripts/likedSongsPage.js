import { ApiError, apiGet, apiPost, Page, Song } from './page.js';

const page = new Page();

async function updateSongs() {
    const likedSongs = await page.getLikedSongs();

    const songRenders = likedSongs.map((song) => {
        return new Song(song, true, true, true, true);
    });

    for (const songRender of songRenders)
        document.getElementById('songTable').innerHTML += songRender.listItem;

    if (songRenders.length === 0)
        document.getElementById('songTableEmpty').classList.remove('hidden');
}

try {
    if ((await page.getUserId()) === null) location.href = 'index.html';
    else {
        page.updatePage();

        await updateSongs();
        page.updateList();
    }
} catch (error) {
    if (error instanceof ApiError) alert(error.message);
    throw error;
}
