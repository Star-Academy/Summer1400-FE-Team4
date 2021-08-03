const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

const response = await fetch(`http://130.185.120.192:5000/song/one/${params.id}`);
if (response.ok)
{
    const song = (await response.json()).song;

    document.getElementById('image').src = song.cover;
    document.getElementById('songName1').innerText = song.name;
    document.getElementById('albumName').innerText = "تک آهنگ";
    document.getElementById('singerName').innerText = song.artist;
    document.getElementById('songLyrics').innerText = song.lyrics;

    // TODO: check in liked playlist
    // if (music.isLiked) {
    //     document.getElementById('notLiked').style.display = 'none';
    // } else {
    //     document.getElementById('liked').style.display = 'none';
    // }
}
else
{
    const error = await response.json();
    alert(error.message);
}
