/* 
❀ By JTxs

[ Canal Principal ] :
https://whatsapp.com/channel/0029VaeQcFXEFeXtNMHk0D0n

[ Canal Rikka Takanashi Bot ] :
https://whatsapp.com/channel/0029VaksDf4I1rcsIO6Rip2X

[ Canal StarlightsTeam ] :
https://whatsapp.com/channel/0029VaBfsIwGk1FyaqFcK91S

[ HasumiBot FreeCodes ] :
https://whatsapp.com/channel/0029Vanjyqb2f3ERifCpGT0W
*/

// *[ ❀ Play de Video (YT) ❀ ]*
import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let [url, resolution] = text.split(' ');

    if (!url) {
        return conn.reply(m.chat, `Ingresa el enlace de un video de YouTube y una calidad, ejemplo:\n\n${usedPrefix + command} *enlace* *360*`, m);
    }

    try {
        // Obtener información del video
        let apiInfo = await fetch(`https://ytdownloader.nvlgroup.my.id/info?url=${url}`);
        let jsonInfo = await apiInfo.json();

        if (!jsonInfo.title) return m.reply('No se pudo obtener información del video. Asegúrate de que el enlace sea válido.');

        let titulo = jsonInfo.title;
        let duracion = jsonInfo.duration || '-';
        let calidad = resolution || '360';
        let img = jsonInfo.thumbnail;
        let dl_url = `https://ytdownloader.nvlgroup.my.id/download?url=${url}&resolution=${calidad}`;

        // Descargar el video
        let vidFetch = await fetch(dl_url);
        let video = await vidFetch.buffer();
        let Tamaño = video.length / (1024 * 1024); // Tamaño en MB

        let HS = `*🎥 Titulo:* ${titulo}\n*🔗 Link:* ${url}\n*⏱️ Duración:* ${duracion}\n*📽️ Calidad:* ${calidad}`;

        if (Tamaño > 100) {
            // Si el tamaño supera los 100 MB, se envía como documento
            await conn.sendMessage(m.chat, { document: video, caption: HS, mimetype: 'video/mp4', fileName: `${titulo}.mp4` });
        } else {
            // Si no, se envía como video normal
            await conn.sendMessage(m.chat, { video: video, caption: HS, mimetype: 'video/mp4' });
        }
    } catch (error) {
        console.error(error);
        m.reply('Hubo un error al procesar tu solicitud. Por favor, intenta nuevamente.');
    }
};

handler.command = ['playvideo', 'playvid', 'ytmp4'];

export default handler;
