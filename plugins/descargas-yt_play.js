// BY JTXS
// Creado : 6/12/24
 
/* 
[ Canal Principal ] :
https://whatsapp.com/channel/0029VaeQcFXEFeXtNMHk0D0n
 
[ Canal Rikka Takanashi Bot ] :
https://whatsapp.com/channel/0029VaksDf4I1rcsIO6Rip2X
 
[ HasumiBot FreeCodes ] :
https://whatsapp.com/channel/0029Vanjyqb2f3ERifCpGT0W
*/


import axios from 'axios'
import yts from 'yt-search'

const handler = async (m, { conn, text, usedPrefix, command }) => {

const formats = ["audio", "video"];
const audioQuality = [320, 256, 192, 128, 64];
const videoQuality = ["360p", "480p", "720p", "1080p"];
const bigconv = {
getToken: async (url) => {
const extractVideoId = (url) => {
const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
const match = url.match(regex);
return match ? match[1] : null;
};
const id = extractVideoId(url);
const config = {
method: 'GET',
url: `https://dd-n01.yt2api.com/api/v4/info/${id}`,
headers: {
'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
'Accept': 'application/json',
'accept-language': 'id-ID',
'referer': 'https://bigconv.com/',
'origin': 'https://bigconv.com',
'alt-used': 'dd-n01.yt2api.com',
'sec-fetch-dest': 'empty',
'sec-fetch-mode': 'cors',
'sec-fetch-site': 'cross-site',
'priority': 'u=0',
'te': 'trailers'
}
};
const response = await axios.request(config);
const cookies = response.headers['set-cookie'];
const processedCookie = cookies ? cookies[0].split(';')[0] : '';
const authorization = response.headers['authorization'] || '';
const result = { data: response.data, cookie: processedCookie, authorization };
return result;
},
convert: async (url, format, quality) => {
const data = await bigconv.getToken(url);
const formats = data.data.formats;
let token;
if (format === "audio") {
const audioOptions = formats.audio.mp3;
const selectedAudio = audioOptions.find(option => option.quality === quality);
if (selectedAudio) {
token = selectedAudio.token;
} else {}
} else if (format === "video") {
let videoOptions = formats.video.mp4;
const selectedVideo = videoOptions.find(option => option.quality === quality);
if (selectedVideo) {
token = selectedVideo.token;
} else {}
} else {}
let raw = JSON.stringify({ "token": token });
const config = {
method: 'POST',
url: 'https://dd-n01.yt2api.com/api/v4/convert',
headers: {
'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
'Accept': 'application/json',
'Content-Type': 'application/json',
'accept-language': 'id-ID',
'referer': 'https://bigconv.com/',
'origin': 'https://bigconv.com',
'sec-fetch-dest': 'empty',
'sec-fetch-mode': 'cors',
'sec-fetch-site': 'cross-site',
'priority': 'u=0',
'te': 'trailers',
'Cookie': data.cookie,
'authorization': data.authorization
},
data: raw
};
let response = await axios.request(config);
return { jobId: response.data.id, cookie: data.cookie, authorization: data.authorization };
},
download: async (url, format, quality) => {
const { jobId, cookie, authorization } = await bigconv.convert(url, format, quality);
return new Promise((resolve, reject) => {
const checkStatus = async () => {
const config = {
method: 'GET',
url: `https://dd-n01.yt2api.com/api/v4/status/${jobId}`,
headers: {
'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
'Accept': 'application/json',
'accept-language': 'id-ID',
'referer': 'https://bigconv.com/',
'origin': 'https://bigconv.com',
'sec-fetch-dest': 'empty',
'sec-fetch-mode': 'cors',
'sec-fetch-site': 'cross-site',
'priority': 'u=4',
'te': 'trailers',
'Cookie': cookie,
'authorization': authorization
}
};
let response = await axios.request(config);
console.log(response.data);
if (response.data.status === 'completed') {
clearInterval(interval);
resolve(response.data);
} else if (response.data.status === 'failed') {
clearInterval(interval);
resolve(response.data);
} else {}};
let interval = setInterval(checkStatus, 5000);
});
}}

if (!text) return m.reply('ingresa el texto de lo que quieras buscar')
let ytsearch = await yts(text)
const ytres = ytsearch.all[0]

let HasumiBotFreeCodes = `*Titulo :* ${ytres.title}
*ID :* ${ytres.videoId}
*Duracion :* ${ytres.timestamp}
*Visitas :* ${ytres.views}
*Subido Hace :* ${ytres.ago}
*Autor :* ${ytres.author.name}
*Canal Url :* ${ytres.author.url}
*Descripcion :* ${ytres.description}
*Url :* ${ytres.url}
`
await conn.sendMessage(m.chat, { text: HasumiBotFreeCodes,
contextInfo: {
forwardingScore: 999, isForwarded: true,
externalAdReply: {
title: ytres.title, body: ``,
mediaType: 1, previewType: 1,
thumbnailUrl: ytres.image, renderLargerThumbnail: true,
mediaUrl: ytres.url, sourceUrl: ytres.url }}},{ quoted: m })
    
try {
let video = await bigconv.download(ytres.url, "video", "360p")
//let audio = await bigconv.download(convert.url, "audio", "320")
conn.reply(m.chat, video, m)
await conn.sendMessage(m.chat, { audio: { url: video.download }, mimetype: 'audio/mpeg', contextInfo: { forwardingScore: 999, isForwarded: true, externalAdReply: { title: ytres.title, mediaType: 1, previewType: 1, body: `Duracion : ${ytres.timestamp} / Visitas : ${ytres.views}`, thumbnailUrl: ytres.image, renderLargerThumbnail: true, mediaUrl: ytres.url, sourceUrl: ytres.url }}},{ quoted: m })
await conn.sendMessage(m.chat, { audio: { url: video.download }, mimetype: 'audio/mpeg', fileName: `${ytres.title}.mp3`, }, { quoted: m })
await conn.sendMessage(m.chat, { video: { url: video.download }, caption: ``, mimetype: 'video/mp4', fileName: `error` + `.mp4`}, {quoted: m })

} catch (error) {
console.log(error)
}}

handler.command = /^(play3)$/i;

export default handler
