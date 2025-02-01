import yts from 'yt-search';
import fetch from 'node-fetch';
import axios from 'axios';

const formatAudio = ['mp3', 'm4a', 'webm', 'acc', 'flac', 'opus', 'ogg', 'wav'];

const ddownr = {
  download: async (url, format) => {
    if (!formatAudio.includes(format)) {
      throw new Error('Formato no compatible, revisa los disponibles.');
    }

    try {
      const response = await axios.get(`https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`);
      
      if (response.data && response.data.success) {
        const { id, title, info } = response.data;
        const { image } = info;
        const downloadUrl = await ddownr.cekProgress(id);

        return { id, image, title, downloadUrl };
      } else {
        throw new Error('No se pudo obtener información del video.');
      }
    } catch (error) {
      console.error('Error en la descarga:', error);
      throw error;
    }
  },
  
  cekProgress: async (id) => {
    try {
      while (true) {
        const response = await axios.get(`https://p.oceansaver.in/ajax/progress.php?id=${id}`);

        if (response.data && response.data.success && response.data.progress === 1000) {
          return response.data.download_url;
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.error('Error en la verificación de progreso:', error);
      throw error;
    }
  }
};

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `❌ Ingresa un nombre de canción. Ejemplo:\n${usedPrefix + command} Despacito`;

  const search = await yts(text);
  
  if (!search.all || search.all.length === 0) throw "❌ No se encontraron resultados.";

  const videoInfo = search.all[0];
  const infoText = `🎵 *Título:* ${videoInfo.title}\n👀 *Vistas:* ${videoInfo.views}\n⏳ *Duración:* ${videoInfo.timestamp}\n📅 *Subido hace:* ${videoInfo.ago}\n🔗 *URL:* ${videoInfo.url}`;

  try {
    if (command === 'play' || command === 'play2' || command === 'playvid') {
      await conn.sendMessage(m.chat, {
        image: { url: videoInfo.thumbnail },
        caption: infoText,
        footer: `🎶 ¿Cómo quieres tu música?`,
        buttons: [
          { buttonId: `.ytmp3 ${videoInfo.url}`, buttonText: { displayText: '🎧 Audio' }, type: 1 },
          { buttonId: `.ytmp4 ${videoInfo.url}`, buttonText: { displayText: '🎬 Video' }, type: 1 }
        ],
        headerType: 4
      }, { quoted: m });

      await m.react('🎵');
    } 
    else if (command === 'yta' || command === 'ytmp3') {
      await m.react('🎧');
      let audio = await ddownr.download(videoInfo.url, 'mp3');
      
      await conn.sendMessage(m.chat, {
        audio: { url: audio.downloadUrl },
        mimetype: "audio/mpeg",
        fileName: `${videoInfo.title}.mp3`
      }, { quoted: m });
    } 
    else if (command === 'ytv' || command === 'ytmp4') {
      await m.react('🎬');
      let api = await fetch(`https://api.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(videoInfo.url)}`);
      let video = await api.json();
      
      if (!video.result || !video.result.download_url) throw "⚠️ No se pudo obtener el video.";

      await conn.sendMessage(m.chat, {
        video: { url: video.result.download_url },
        mimetype: "video/mp4",
        caption: `🎬 *Título:* ${videoInfo.title}\n🔗 *URL:* ${videoInfo.url}`
      }, { quoted: m });
    } 
    else {
      throw "❌ Comando no reconocido.";
    }
  } catch (error) {
    console.error('Error en el procesamiento:', error);
    throw "⚠️ Ocurrió un error al procesar tu solicitud.";
  }
};

handler.command = ['play', 'playvid', 'ytv', 'ytmp4', 'yta', 'play2', 'ytmp3'];
handler.tags = ['descargas'];
handler.diamond = 4;

export default handler;
