import fetch from "node-fetch";
import yts from "yt-search";

let handler = async (m, { conn, args }) => {
  try {
    const text = args.join(" ");
    if (!text.trim()) {
      return m.reply(
        `「 ✰ 」INGRESA UN *ENLACE* O *TÍTULO* DEL *VIDEO* QUE DESEA DESCARGAR DE *YOUTUBE*\n\n*• EJEMPLO:*\n> .playvideo Never Gonna Give You Up`
      );
    }

    // Buscar el video en YouTube
    const search = await yts(text);
    if (!search.videos.length) {
      return m.reply("No se encontraron resultados para tu búsqueda.");
    }

    const video = search.videos[0];
    const infoMessage = `「 ✰ 」 *RESULTADOS ENCONTRADOS:*\n> BUSQUEDA: ${text}\n\n✰ *TÍTULO:*\n> ${video.title}\n\`\`\`----------\`\`\`\n✰ *VISTAS:*\n> ${video.views}\n\`\`\`----------\`\`\`\n✰ *DURACIÓN:*\n> ${video.duration}\n\`\`\`----------\`\`\`\n✰ *SUBIDO:*\n> ${video.ago}\n\`\`\`----------\`\`\`\n✰ *URL:*\n> ${video.url}\n\`\`\`----------\`\`\`\n\n\`ENVIANDO VIDEO...\``;

    // Enviar la información del video
    await conn.sendMessage(
      m.chat,
      { image: { url: video.thumbnail }, caption: infoMessage },
      { quoted: m }
    );

    // Descargar el video usando la API
    const apiUrl = `https://deliriussapi-oficial.vercel.app/download/ytmp4v2?url=${video.url}`; // Ajusta la calidad si lo deseas
    const res = await fetch(apiUrl);

    // Obtener el video descargado en un buffer
    const buffer = await res.buffer();

    // Obtener el tamaño del video en megabytes
    const sizeInBytes = buffer.byteLength;
    const sizeInMB = (sizeInBytes / 1024 / 1024).toFixed(2);

    // Enviar el video como un buffer
    await conn.sendMessage(
      m.chat,
      {
        video: buffer,
        mimetype: 'video/mp4', // Ajusta el mimetype según el formato del video
        fileName: `${video.title}.mp4`, // Ajusta el nombre del archivo
        caption: `✰ *TÍTULO:* ${video.title}\n✰ *TAMAÑO:* ${sizeInMB} MB`,
      },
      { quoted: m }
    );
  } catch (e) {
    console.error(e);
    await m.reply(`「 ✰ 」Error al descargar el video: ${e.message}`);
  }
};

handler.help = ["playvideo <enlace/título>"];
handler.tags = ["downloader"];
handler.command = /^(playvideo|ytvideo)$/i;
handler.limit = true;

export default handler;
