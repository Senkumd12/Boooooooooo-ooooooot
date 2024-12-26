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
    const infoMessage = `「 ✰ 」 *RESULTADOS ENCONTRADOS:*\n> BUSQUEDA: ${text}\n\n✰ *TÍTULO:*\n> ${video.title}\n\`\`\`----------\`\`\`\n✰ *VISTAS:*\n> ${video.views}\n\`\`\`----------\`\`\`[...]`;

    // Enviar información del video
    await conn.sendMessage(
      m.chat,
      { image: { url: video.thumbnail }, caption: infoMessage },
      { quoted: m }
    );

    // Elegir API para descargar el video
    const apiChoice = 1; // Cambiar a 2 para usar la segunda API
    
    let apiUrl;
    if (apiChoice === 1) {
      apiUrl = `https://deliriussapi-oficial.vercel.app/download/ytmp4?url=${video.url}`;
    } else {
      apiUrl = `https://apis-starlights-team.koyeb.app/starlight/youtube-mp4?url=${video.url}`;
    }

    const res = await fetch(apiUrl);
    const json = await res.json();

    if (!res.ok || !json || !json.download_url) {
      throw new Error(`Error al descargar el video: ${res.statusText}`);
    }

    // Descargar el video desde la URL proporcionada en la respuesta JSON
    const videoRes = await fetch(json.download_url);
    if (!videoRes.ok) {
      throw new Error(`Error al descargar el video: ${videoRes.statusText}`);
    }

    // Obtener el video descargado como buffer
    const buffer = await videoRes.buffer();

    // Enviar el video como un buffer
    await conn.sendMessage(
      m.chat,
      {
        video: buffer,
        mimetype: "video/mp4",
        fileName: `${video.title}.mp4`,
        caption: `✰ *TÍTULO:* ${video.title}`,
      },
      { quoted: m }
    );
  } catch (e) {
    console.error(e);
    m.reply(`「 ✰ 」Error al descargar el video: ${e.message}`);
  }
};

handler.help = ["playvideo <enlace/título>"];
handler.tags = ["downloader"];
handler.command = /^(playvideo|ytvideo)$/i;

export default handler;
