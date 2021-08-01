import { albums, singers } from "./data.js";

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

let singer = singers.filter((s) => s.name === params.name);
let singerAlbums = albums.filter(
  (s) => s.singer.toLowerCase() === params.name.toLowerCase()
);
let banner = document.getElementById("banner");
let shelf = document.getElementById("shelf");
let bannerHtml = "";
let shelfHtml = "";

if (singer.length < 1) {
  location.replace("index.html");
} else {
  let singer1 = singer[0];
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

  document.getElementById("banner").innerHTML += bannerHtml;
  document.getElementById("shelf").innerHTML += shelfHtml;
}
