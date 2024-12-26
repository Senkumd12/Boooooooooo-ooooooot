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

import axios from 'axios';
import yts from 'yt-search';

const handler = async (m, { conn, text, command }) => {
    if (!text || text.trim() === "") {
        return m.reply(`Por favor, ingresa el texto o enlace del video que deseas buscar/descargar.`);
    }

    try {
        // Buscar en YouTube
        let ytsearch = await yts(text);
        const ytres = ytsearch.all[0];

        // Verificación inicial para `.play` y `.play3`
        if (command === 'play' && ytres.timestamp.includes(':') && parseInt(ytres.timestamp.split(':')[0]) >= 1) {
            return m.reply('El video no puede durar más de 1 hora.');
        }

        // Información del video
        let info = `*Titulo :* ${ytres.title}
*Duración :* ${ytres.timestamp}
*Visitas :* ${ytres.views}
*Subido Hace :* ${ytres.ago}
*Autor :* ${ytres.author.name}
*Descripción :* ${ytres.description}
*Url :* ${ytres.url}`;

        await conn.sendMessage(m.chat, {
            text: info,
            contextInfo: {
                externalAdReply: {
                    title: ytres.title,
                    mediaType: 1,
                    previewType: 1,
                    thumbnailUrl: ytres.image,
                    mediaUrl: ytres.url
                }
            }
        }, { quoted: m });

        // Descargar video/audio
        if (command === 'play3') {
            // Descarga usando bigconv
            const bigconv = {
                getToken: async (url) => {
                    const id = url.split('v=')[1] || url.split('/').pop();
                    const response = await axios.get(`https://dd-n01.yt2api.com/api/v4/info/${id}`);
                    const cookies = response.headers['set-cookie']?.[0]?.split(';')[0] || '';
                    return { data: response.data, cookie: cookies };
                },
                download: async (url, format, quality) => {
                    const { data, cookie } = await bigconv.getToken(url);
                    const formats = data.formats[format];
                    const selected = formats.find(option => option.quality === quality);
                    if (!selected) throw new Error('No se encontró la calidad solicitada.');

                    const response = await axios.post('https://dd-n01.yt2api.com/api/v4/convert', {
                        token: selected.token
                    }, {
                        headers: { Cookie: cookie }
                    });

                    return response.data.download_url;
                }
            };

            const videoUrl = await bigconv.download(ytres.url, 'video', '360p');
            await conn.sendMessage(m.chat, { video: { url: videoUrl }, caption: ytres.title }, { quoted: m });
        } else {
            // Descarga usando API alternativa
            const api = await axios.get(`https://Ikygantengbangetanjay-api.hf.space/yt?query=${encodeURIComponent(text)}`);
            const json = api.data.result;

            await conn.sendMessage(m.chat, { audio: { url: json.download.audio }, mimetype: 'audio/mpeg', fileName: `${json.title}.mp3` }, { quoted: m });
            await conn.sendMessage(m.chat, { video: { url: json.download.video }, mimetype: 'video/mp4', fileName: `${json.title}.mp4` }, { quoted: m });
        }

    } catch (error) {
        console.error(error);
        m.reply('Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.');
    }
};

handler.command = /^(play|play3)$/i;

export default handler;
