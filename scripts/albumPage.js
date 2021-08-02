import { albums } from './data.js';
import { likeIcon } from './functions.js';

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

const album = albums.filter((a) => a.name === params.name);
const songTable = document.getElementById('songTable');
const banner = document.getElementById('banner');
let songTableHtml = '';
let bannerHtml = '';

if (album.length < 1) {
    location.replace('index.html');
} else {
    const album1 = album[0];
    console.log(album1.singer);
    bannerHtml = `<div class="banner-image">
                    <img src="${album1.imageAddress}" alt="">
                </div>
                <div class="banner-desc">
                    <h1>${album1.name}(Original Soundtrack)</h1>
                    <div>
                        <strong>${album1.singer}</strong> &bullet;
                        نوامبر ۲۰۲۱ &bullet;
                        ۷ آهنگ،
                        ۱۳ دقیقه و 
                        ۶۴ ثانیه
                    </div>
                </div>`;
    for (const song of album1.songs) {
        songTableHtml += `<div class="row">
                        <div>${album1.songs.indexOf(song) + 1}</div>
                        <div><a href="music.html?name=${song.name}">${
            song.name
        }</a> <br> <a href="artist.html?name=${album1.singer}"><small>${
            album1.singer
        }</small></a></div>
                        <div>
                            <svg id="dislike${album1.songs.indexOf(
                                song
                            )}" data-index="${album1.songs.indexOf(
            song
        )}" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="dislike-icon icon ${
            song.isLiked ? 'hidden' : ''
        }" viewBox="0 0 16 16">
                                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                            </svg>
                            <svg id="like${album1.songs.indexOf(
                                song
                            )}" data-index="${album1.songs.indexOf(
            song
        )}" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="like-icon icon filled ${
            song.isLiked ? '' : 'hidden'
        }" viewBox="0 0 16 16">
                                <path fill-rule="evenodd"
                              d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                            </svg>                
                        </div>
                        <div>${song.duration}</div>
                    </div>`;
    }

    banner.innerHTML += bannerHtml;
    songTable.innerHTML += songTableHtml;
    likeIcon();
}
