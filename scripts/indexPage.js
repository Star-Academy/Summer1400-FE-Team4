import { albums, singers } from './data.js';

// show albums
let albumsHtml = albums.map((album) => {
    return `<a href="album.html?name=${album.name}" >
            <div class="shelf-card">
                <div class="card-image">
                    <img src="${album.imageAddress}" alt="">
                </div>
                <span>${album.name}</span>
            </div>
        </a>
        `;
}).reduce((s, a) => s + a);

let albumitems = document.getElementById("albumshelf");
albumitems.innerHTML = albumsHtml;

// show singers
let singersHtml = singers.map((singer) => {
    return `<a href="artist.html?name=${singer.name}" >
            <div class="shelf-card">
                <div class="card-image">
                    <img src="${singer.imageAddress}" alt="">
                </div>
                <span>${singer.name}</span>
            </div>
        </a>
        `;
}).reduce((s, a) => s + a);

let singeritems = document.getElementById("singershelf");
singeritems.innerHTML = singersHtml;
