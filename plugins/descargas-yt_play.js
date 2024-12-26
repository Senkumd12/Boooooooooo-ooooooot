import fetch from 'node-fetch';
import yts from 'yt-search';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Ejemplo: ${usedPrefix + command} diles`;

    // Buscar el video en YouTube
    let search = await yts(text);
    let isVideo = /vid$/.test(command);
    let urls = search.all[0].url;
    let body = `\`YouTube Play\`

    *Título:* ${search.all[0].title}
    *Vistas:* ${search.all[0].views}
    *Duración:* ${search.all[0].timestamp}
    *Subido:* ${search.all[0].ago}
    *Url:* ${urls}

🕒 *Su ${isVideo ? 'Video' : 'Audio'} se está enviando, espere un momento...*`;

    // Enviar información del video
    await conn.sendMessage(m.chat, {
        image: { url: search.all[0].thumbnail },
        caption: body
    }, { quoted: m });
    m.react('react1');

    try {
        // Descargar el video usando la nueva API proporcionada
        let res = await dl_vid(urls);
        let type = isVideo ? 'video' : 'audio';
        let mediaUrl = isVideo ? res.data.video : res.data.audio;

        if (!mediaUrl) {
            throw new Error(`No se pudo obtener la URL del ${type} del video.`);
        }

        // Enviar el video o audio descargado
        await conn.sendMessage(m.chat, {
            [type]: { url: mediaUrl },
            gifPlayback: false,
            mimetype: isVideo ? "video/mp4" : "audio/mpeg"
        }, { quoted: m });
    } catch (error) {
        console.error(error);
        m.reply(`Error al descargar el video: ${error.message}`);
    }
};

handler.command = ['play', 'playvid'];
handler.help = ['play', 'playvid'];
handler.tags = ['dl'];
export default handler;

async function dl_vid(url) {
    const response = await fetch('https://deliriussapi-oficial.vercel.app/download/ytmp4v2?url=' + encodeURIComponent(url), {
        method: 'GET',
        headers: {
            'accept': '*/*'
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data || !data.data) {
        throw new Error('La respuesta de la API no contiene los datos esperados.');
    }

    return data;
}
