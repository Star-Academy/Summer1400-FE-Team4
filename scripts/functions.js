function likeIcon() {
    for (const element of document.getElementsByClassName('like-icon')) {
        element.onclick = function () {
            element.classList.add('hidden');
            let other = document.getElementById(
                'dislike' + element.getAttribute('data-index')
            );
            other.classList.remove('hidden');
        };
    }

    for (const element of document.getElementsByClassName('dislike-icon')) {
        element.onclick = function () {
            element.classList.add('hidden');
            let other = document.getElementById(
                'like' + element.getAttribute('data-index')
            );
            other.classList.remove('hidden');
        };
    }
}

function addSongTable(results) {
    const resultsHtml = results
        .map((song, index) => {
            return `<div class="row">
                <div>${index + 1}</div>
                <div><img src="${song.album.imageAddress}" alt="" ></div>
                <div><a href="music.html?name=${song.name}">${
                song.name
            }</a> <br>
                    <a href="artist.html?name=${song.album.singer}"><small>${
                song.album.singer
            }</small></a>
                </div>
                <div><a href="album.html?name=${song.album.name}">${
                song.album.name
            }</a></div>
                <div>${song.album.releasedDate}</div>
                <div>
                    <svg id="dislike${index}" data-index="${index}" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="dislike-icon icon ${
                song.isLiked ? 'hidden' : ''
            }" viewBox="0 0 16 16">
                        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                    </svg>
                    <svg id="like${index}" data-index="${index}" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="like-icon icon filled ${
                song.isLiked ? '' : 'hidden'
            }" viewBox="0 0 16 16">
                        <path fill-rule="evenodd"
                              d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                    </svg>
                </div>
                <div>${song.duration}</div>
            </div>`;
        })
        .reduce((accumulator, currentValue) => accumulator + currentValue, '');

    document.getElementById('songTable').innerHTML += resultsHtml;
}

function albumHtml(album1, song) {
    return `<div class="row">
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

export { likeIcon, addSongTable, albumHtml };
