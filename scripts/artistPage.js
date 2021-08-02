import { albums, singers } from './data.js';

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

const singer = singers.filter((s) => s.name === params.name);
const singerAlbums = albums.filter(
    (album) => album.singer.toLowerCase() === params.name.toLowerCase()
);
const banner = document.getElementById('banner');
const shelf = document.getElementById('shelf');
let bannerHtml = '';
let shelfHtml = '';

if (singer.length < 1) {
    location.replace('index.html');
} else {
    const singer1 = singer[0];
    console.log(singer1.name);
    console.log(singer1.imageAddress);
    bannerHtml =
        `<div class="banner-image">
                    
                    <img id="image" src="${singer1.imageAddress}" alt="">
                </div>
                <div class="banner-desc">
                    <h1 id="singerName">${singer1.name}</h1>
                    <div>
                        <span id="albumCount">${singerAlbums.length}</span>
                        آلبوم
                    </div>
                </div>` + '<section class="shelf in-artist" id="albumShelf">';
    for (const singerAlbumElement of singerAlbums) {
        shelfHtml += `<a href="album.html?name=${singerAlbumElement.name}">
                        <div class="shelf-card">
                            <div class="card-image">
                                <img src="${singerAlbumElement.imageAddress}" alt="">
                            </div>
                            <span>${singerAlbumElement.name}</span>
                        </div>
                    </a>`;
    }

    banner.innerHTML += bannerHtml;
    shelf.innerHTML += shelfHtml;
}
