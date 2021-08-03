const apiUrl = 'http://130.185.120.192:5000/';

class ApiError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'API Error';
        this.code = cods;
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

class Page {
    constructor() {}

    // returns null if an auth token is not
    get authToken() {
        //return localStorage.getItem('authToken');
        return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTYsImlhdCI6MTYyNzk5MDYxM30._4hpcq790rLVQP_nMAQtkxCWKHh7Hw3WD5oVILGwQ5g';
    }

    removeAuthToken() {
        localStorage.removeItem('authToken');
    }

    // returns null if the user in not logged in
    async getUserId() {
        if (this.authToken === null) return null;

        const result = await apiPost('user/auth', {
            token: this.authToken,
        });

        return result.id;
    }

    // throws an Exception if user is not logged in
    async currentUser() {
        const id = getUserId();
        return (await apiGet(apiUrl + 'user/one' + id)).user;
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
        if (this.likedSongs !== undefined) return this.likedSongs;
        return (this.likedSongs = this.fetchLikedSongs());
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

    registerLikeButtons() {
        function toggleOther(element) {
            element.classList.add('hidden');
            const otherId = element.getAttribute('data-toggle');
            const other = document.getElementById(otherId);
            other.classList.remove('hidden');
        }

        const that = this;

        for (const element of document.getElementsByClassName('like-button')) {
            element.onclick = async function () {
                await that.likeSong(element.getAttribute('data-id'));
                toggleOther(element);
            };
        }

        for (const element of document.getElementsByClassName('dislike-button')) {
            element.onclick = async function () {
                await that.dislikeSong(element.getAttribute('data-id'));
                toggleOther(element);
            };
        }
    }
}

export { ApiError, apiGet, apiPost, Page };
