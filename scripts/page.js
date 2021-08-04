const apiUrl = 'http://130.185.120.192:5000/';

class ApiError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'API Error';
        this.code = code;
    }
}

async function apiGet(path) {
    const response = await fetch(apiUrl + path);
    if (response.ok) return await response.json();
    else throw new ApiError((await response.json()).message, response.code);
}

async function apiPost(path, data, hasResponse = true) {
    const response = await fetch(apiUrl + path, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (response.ok) {
        if (hasResponse) return await response.json();
    } else throw new ApiError((await response.json()).message, response.code);
}

class Song {
    constructor(data, liked, showCover = true, showArtist = true, showAlbum = true) {
        this.id = data.id;
        this.name = data.name;
        this.artist = data.artist;
        this.lyrics = data.lyrics;
        this.file = data.file;
        this.cover = data.cover;
        this.liked = liked;
        this.showCover = showCover;
        this.showArtist = showArtist;
        this.showAlbum = showAlbum;
    }

    get listItem() {
        let html = `
        <div data-id="${this.id}" data-file="${this.file}" class="row">
            <div>
                <button
                    id="playButton${this.id}"
                    data-toggle="pauseButton${this.id}"
                    class="play-button icon-button"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        class="icon icon-play"
                        viewBox="0 0 16 16"
                    >
                        <path
                            d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
                        />
                        <path
                            d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"
                        />
                    </svg>
                </button>
                <button
                    id="pauseButton${this.id}"
                    data-toggle="playButton${this.id}"
                    class="pause-button icon-button hidden"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        class="icon icon-pause selected"
                        viewBox="0 0 16 16"
                    >
                        <path
                            d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
                        />
                        <path
                            d="M5 6.25a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5zm3.5 0a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5z"
                        />
                    </svg>
                </button>
            </div>`;
        if (this.showCover)
            html += `
            <div>
                <img src="${this.cover}" alt=""></img>
            </div>`;

        html += `
            <div>
                <h5>
                    <a href="music.html?id=${this.id}">${this.name}</a>
                </h5>`;

        if (this.showArtist)
            html += `
                <div>
                    <a href="artist.html?name=${this.artist}">
                        <small>${this.artist}</small>
                    </a>
                </div>`;

        html += `
            </div>`;

        if (this.showAlbum)
            html += `
            <div>
                <a href="album.html?id=${this.id}">${this.name}</a>
            </div>
            <div>`;

        if (this.liked !== null)
            html += `
                <button
                    id="likeButton${this.id}"
                    data-toggle="dislikeButton${this.id}"
                    class="like-button icon-button ${this.liked ? 'hidden' : ''}"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        class="icon"
                        viewBox="0 0 16 16"
                    >
                        <path
                            d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"
                        />
                    </svg>
                </button>
                <button
                    id="dislikeButton${this.id}"
                    data-toggle="likeButton${this.id}"
                    class="dislike-button icon-button ${this.liked ? '' : 'hidden'}"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        class="icon selected"
                        viewBox="0 0 16 16"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                        />
                    </svg>
                </button>`;

        html += `
            </div>
            <div class="song-duration"></div>
        </div>`;
        return html;
    }

    get shelfItem() {}
}

class Page {
    constructor() {
        this.audio = new Audio();
    }

    // returns null if an auth token is not
    get authToken() {
        return localStorage.getItem('authToken');
    }

    removeAuthToken() {
        localStorage.removeItem('authToken');
    }

    // returns null if the user is not logged in
    async getUserId() {
        if (this.authToken === null) return null;

        // cache result
        if (this.userId === undefined) this.userId = await this.fetchUserId();
        return this.userId;
    }

    async fetchUserId() {
        try {
            const result = await apiPost('user/auth', {
                token: this.authToken,
            });
            return result.id;
        } catch (error) {
            if (error instanceof ApiError && error.code === 401) {
                // unauthorized
                return null;
            }
            throw error;
        }
    }

    // throws an Exception if user is not logged in
    async getCurrentUser() {
        // cache result
        if (this.user === undefined) {
            const id = await this.getUserId();
            this.user = (await apiGet('user/one/' + id)).user;
        }
        return this.user;
    }

    // throws an exception if the user is not logged in
    async createLikedSongsPlaylist() {
        if (this.authToken === null) throw Error('User is not logged in!');

        const playlistId = await apiPost('playlist/create', {
            token: this.authToken,
            name: 'favorites',
        });

        this.likedSongsPlaylistId = playlistId.id;
        console.debug('created favorites playlist, id = ' + this.likedSongsPlaylistId);
    }

    async getLikedSongs() {
        // cache results
        if (this.likedSongs === undefined) this.likedSongs = await this.fetchLikedSongs();
        return this.likedSongs;
    }

    // returns an empty list if the user is not logged in
    async fetchLikedSongs() {
        if (this.authToken === null) return [];

        const playlists = await apiPost('playlist/all', {
            token: this.authToken,
        });
        const likedSongsPlaylist = playlists.find((playlist) => playlist.name === 'favorites');

        if (likedSongsPlaylist === undefined) {
            await this.createLikedSongsPlaylist();
            return [];
        }

        this.likedSongsPlaylistId = likedSongsPlaylist.id;
        console.debug('fetched favorites playlist, id = ' + this.likedSongsPlaylistId);

        return likedSongsPlaylist.songs.map((song) => song.rest);
    }

    async likeSong(id) {
        await apiPost(
            'playlist/add-song',
            {
                token: this.authToken,
                playlistId: this.likedSongsPlaylistId,
                songId: id,
            },
            false
        );
    }

    async dislikeSong(id) {
        await apiPost(
            'playlist/remove-song',
            {
                token: this.authToken,
                playlistId: this.likedSongsPlaylistId,
                songId: id,
            },
            false
        );
    }

    updateList() {
        function getOther(element) {
            const otherId = element.getAttribute('data-toggle');
            return document.getElementById(otherId);
        }

        function toggleOther(element) {
            element.classList.add('hidden');
            getOther(element).classList.remove('hidden');
        }

        for (const element of document.getElementsByClassName('like-button')) {
            element.onclick = async () => {
                const id = element.closest('.row').getAttribute('data-id');
                await this.likeSong(id);
                toggleOther(element);
            };
        }

        for (const element of document.getElementsByClassName('dislike-button')) {
            element.onclick = async () => {
                const id = element.closest('.row').getAttribute('data-id');
                await this.dislikeSong(id);
                toggleOther(element);
            };
        }

        for (const element of document.getElementsByClassName('play-button')) {
            element.onclick = async () => {
                this.audio.src = element.closest('.row').getAttribute('data-file');
                this.audio.play();
                for (const element of document.getElementsByClassName('pause-button'))
                    toggleOther(element);
                toggleOther(element);
            };
        }

        for (const element of document.getElementsByClassName('pause-button')) {
            element.onclick = async () => {
                this.audio.pause();
                toggleOther(element);
            };
        }

        this.audio.onended = () => {
            for (const element of document.getElementsByClassName('pause-button'))
                toggleOther(element);
        };

        for (const element of document.getElementsByClassName('song-duration')) {
            const src = element.closest('.row').getAttribute('data-file');
            const audio = new Audio();
            audio.preload = 'metadata';
            audio.src = src;
            audio.onloadedmetadata = () => {
                const minutes = Math.floor(audio.duration / 60).toLocaleString('fa-IR');
                const seconds = Math.floor(audio.duration % 60)
                    .toLocaleString('fa-IR')
                    .padStart(2, '۰');
                element.innerText = `${minutes}:${seconds}`;
                audio.remove();
            };
        }
    }

    async updatePage() {
        if ((await this.getUserId()) !== null) {
            // user is logged in
            const user = await this.getCurrentUser();

            document.getElementById('unauthedNav').classList.add('hidden');
            document.getElementById('authedNav').classList.remove('hidden');
            document.getElementById('likedSongsButton').classList.remove('hidden');
            document.getElementById('helloName').innerText = user.first_name;
            document.getElementById('logoutButton').onclick = () => {
                this.removeAuthToken();
                location.reload();
            };
        }
    }
}

export { ApiError, Song, apiGet, apiPost, Page };
