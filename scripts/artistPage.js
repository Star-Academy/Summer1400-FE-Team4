import { albums, singers } from './data';

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

let singer = singers.filter((s) => s.name === params.name);

if (singer.length === 0)
    location.replace("index.html");
else
{
    let singer = singer[0];
    
}
