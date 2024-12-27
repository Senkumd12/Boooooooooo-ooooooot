import { generateWAMessageFromContent } from '@whiskeysockets/baileys';

const idGroup = "120363179453431130@g.us"; // ID del grupo donde se enviará la información

var handler = async (m, { conn, text }) => {
    if (!m.quoted && !text) 
        return conn.reply(m.chat, `🚩 Por favor, escribe tu mensaje o cita el contenido que deseas enviar.`, m);

    try {
        let quoted = m.quoted || m; // Mensaje citado o actual
        let mime = (quoted.msg || quoted).mimetype || ''; // Tipo de archivo
        let isMedia = /image|video|sticker|audio/.test(mime); // Verificar si es multimedia
        let content;

        // Procesar el contenido según el tipo de mensaje
        if (isMedia) {
            const media = await quoted.download?.();
            if (!media) return m.reply('⚠️ No se pudo descargar el archivo. Intenta nuevamente.');

            if (/image/.test(mime)) {
                content = { image: media, caption: text || '' };
            } else if (/video/.test(mime)) {
                content = { video: media, caption: text || '' };
            } else if (/audio/.test(mime)) {
                content = { audio: media, mimetype: 'audio/mp4' };
            } else if (/sticker/.test(mime)) {
                content = { sticker: media };
            }
        } else {
            content = { text: text || '' };
        }

        // Enviar al grupo
        await conn.sendMessage(idGroup, content, { quoted: null });
        m.reply('✅ Mensaje enviado al grupo correctamente.');
    } catch (err) {
        console.error('Error:', err);
        m.reply('⚠️ Ocurrió un error al enviar el mensaje. Por favor, intenta de nuevo.');
    }
};

handler.help = ['enviargrupo'];
handler.tags = ['main'];
handler.command = ['enviargrupo']; // Nombre del comando
handler.register = false;

export default handler;
