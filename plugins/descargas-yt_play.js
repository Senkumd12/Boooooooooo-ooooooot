/**
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

import fetch from "node-fetch";
import yts from "yt-search";

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const [query, resolution] = text.split(" ");
  if (!query) {
    return conn.reply(m.chat, `Usa: ${usedPrefix + command} <palabra clave> <calidad>`, m);
  }

  try {
    await m.reply("Buscando, por favor espera...");

    // Buscar video por palabra clave
    const search = await yts(query);
    const video = search.videos[0];
    if (!video) return conn.reply(m.chat, "No se encontraron resultados.", m);

    const { title, timestamp, views, ago, url, thumbnail } = video;
    const quality = resolution || "360";

    const videoInfo = `*🎥 Título:* ${title}\n*⏳ Duración:* ${timestamp}\n*👀 Vistas:* ${views.toLocaleString()}\n*📅 Subido:* ${ago}\n*🔗 Link:* ${url}`;
    const ytThumb = (await conn.getFile(thumbnail))?.data;

    await conn.reply(m.chat, videoInfo, m, {
      contextInfo: {
        externalAdReply: {
          title: "YouTube - Play",
          body: "Descargando video...",
          thumbnail: ytThumb,
          mediaUrl: url,
          renderLargerThumbnail: true,
          sourceUrl: url,
        },
      },
    });

    // Descargar video
    const apiResponse = await fetch(`https://ytdownloader.nvlgroup.my.id/info?url=${url}`);
    const jsonInfo = await apiResponse.json();

    const dlUrl = `https://ytdownloader.nvlgroup.my.id/download?url=${url}&resolution=${quality}`;
    const videoBuffer = await (await fetch(dlUrl)).buffer();
    const sizeInMB = videoBuffer.length / (1024 * 1024);

    const downloadMessage = `*✅ Descarga completa*\n*🎥 Título:* ${title}\n*📏 Tamaño:* ${sizeInMB.toFixed(2)} MB\n*📹 Calidad:* ${quality}`;
    
    // Enviar video
    if (sizeInMB > 100) {
      await conn.sendMessage(m.chat, { document: videoBuffer, caption: downloadMessage, mimetype: "video/mp4", fileName: `${title}.mp4` });
    } else {
      await conn.sendMessage(m.chat, { video: videoBuffer, caption: downloadMessage, mimetype: "video/mp4" });
    }
  } catch (error) {
    console.error(error);
    await conn.reply(m.chat, "Ocurrió un error al procesar tu solicitud. Intenta de nuevo.", m);
  }
};

handler.command = /^(play|playvideo)$/i;

export default handler;
