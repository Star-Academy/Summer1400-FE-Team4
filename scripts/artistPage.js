import { ApiError, apiGet, apiPost, Page, Song } from './page.js';

const page = new Page();

async function getSongs() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    const results = (
        await apiPost('song/find', {
            phrase: params.name,
            count: 100,
            sorter: 'name',
            desc: true,
        })
    ).songs;

    return results.filter(song => song.artist.search(params.name) > -1)
}

async function updateSongs() {
    const songs = await getSongs();

    if (songs.length === 0) {
        alert('خواننده وجود ندارد!')
        return;
    }
    
    document.getElementById('image').src = songs[songs.length - 1].cover;
    document.getElementById('singerName').innerText = songs[songs.length - 1].artist;
    document.getElementById('albumCount').innerText = songs.length.toLocaleString('fa-IR') + ' آلبوم';

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

    await updateSongs();
} catch (error) {
    if (error instanceof ApiError) alert(error.message);
    throw error;
}

// import { albums, singers } from './data.js';

// const urlSearchParams = new URLSearchParams(window.location.search);
// const params = Object.fromEntries(urlSearchParams.entries());

// const singer = singers.filter((s) => s.name === params.name);
// const singerAlbums = albums.filter(
//     (album) => album.singer.toLowerCase() === params.name.toLowerCase()
// );
// const banner = document.getElementById('banner');
// const shelf = document.getElementById('shelf');
// let bannerHtml = '';
// let shelfHtml = '';

// if (singer.length < 1) {
//     location.replace('index.html');
// } else {
//     const singer1 = singer[0];
//     console.log(singer1.name);
//     console.log(singer1.imageAddress);
//     bannerHtml =
//         `<div class="banner-image">
                    
//                     <img id="image" src="${singer1.imageAddress}" alt="">
//                 </div>
//                 <div class="banner-desc">
//                     <h1 id="singerName">${singer1.name}</h1>
//                     <div>
//                         <span id="albumCount">${singerAlbums.length}</span>
//                         آلبوم
//                     </div>
//                 </div>` + '<section class="shelf in-artist" id="albumShelf">';
//     for (const singerAlbumElement of singerAlbums) {
//         shelfHtml += `<a href="album.html?name=${singerAlbumElement.name}">
//                         <div class="shelf-card">
//                             <div class="card-image">
//                                 <img src="${singerAlbumElement.imageAddress}" alt="">
//                             </div>
//                             <span>${singerAlbumElement.name}</span>
//                         </div>
//                     </a>`;
//     }

//     banner.innerHTML += bannerHtml;
//     shelf.innerHTML += shelfHtml;
// }
