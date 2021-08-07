import { albums } from './data.js';
import { likeIcon, albumHtml } from './functions.js';

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
        songTableHtml += albumHtml(album1, song);
    }

    banner.innerHTML += bannerHtml;
    songTable.innerHTML += songTableHtml;
    likeIcon();
}
