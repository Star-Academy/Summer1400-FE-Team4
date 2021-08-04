import { ApiError, apiGet, apiPost, Page, Song } from './page.js';

const page = new Page();

async function getSongs() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    if ('query' in params && params.query.trim().length > 0) {
        const query = params.query;
        document.getElementById('query').value = query;

        return (
            await apiPost('song/find', {
                phrase: query,
                count: 10,
                sorter: 'name',
                desc: true,
            })
        ).songs;
    }

    return (
        await apiPost('song/page', {
            size: 10,
            current: 1,
            sorter: 'name',
            desc: true,
        })
    ).songs;
}

async function updateSongs() {
    const [songs, likedSongs] = await Promise.all([getSongs(), page.getLikedSongs()]);

    let loggedIn = await page.getUserId() !== null;
    const songRenders = songs.map((song) => {
        let liked = null;
        if (loggedIn)
            liked = likedSongs.find((likedSong) => likedSong.id === song.id) !== undefined;
        return new Song(song, liked, true, true, true);
    });

    for (const songRender of songRenders)
        document.getElementById('songTable').innerHTML += songRender.listItem;

    if (songRenders.length === 0)
        document.getElementById('songTableEmpty').classList.remove('hidden');
}

try {
    page.updatePage();

    await updateSongs();
    page.updateList();
} catch (error) {
    if (error instanceof ApiError) alert(error.message);
    throw error;
}
