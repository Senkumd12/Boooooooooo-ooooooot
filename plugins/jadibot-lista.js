import ws from 'ws';

async function handler(m, { conn: _envio, usedPrefix }) {
  // Obtener lista de sub-bots conectados
  const users = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])];

  // Función para formatear tiempo en días, horas, minutos y segundos
  function convertirMsADiasHorasMinutosSegundos(ms) {
    var segundos = Math.floor(ms / 1000);
    var minutos = Math.floor(segundos / 60);
    var horas = Math.floor(minutos / 60);
    var días = Math.floor(horas / 24);
    segundos %= 60;
    minutos %= 60;
    horas %= 24;

    var resultado = "";
    if (días !== 0) resultado += días + " días, ";
    if (horas !== 0) resultado += horas + " horas, ";
    if (minutos !== 0) resultado += minutos + " minutos, ";
    if (segundos !== 0) resultado += segundos + " segundos";
    return resultado;
  }

  // Generar lista de sub-bots conectados
  const message = users
    .map((v, index) => `(${index + 1})\n║◉—⛩️ wa.me/${v.user.jid.replace(/[^0-9]/g, '')}?text=${usedPrefix}estado\n*║◉—⛩️ Usuario  :* *${v.user.name || '-'}*\n*║◉—⛩️ Tiempo Conectado:* ${v.uptime ? convertirMsADiasHorasMinutosSegundos(Date.now() - v.uptime) : "Desconocido"}`)
    .join('\n\n••••••••••••••••••••••••••••••••••••\n\n');

  const replyMessage = message.length === 0 ? '*NO HAY SUB BOTS DISPONIBLE. VERIFIQUE MÁS TARDE.*' : message;
  const totalUsers = users.length;

  const responseMessage = `╭═══〘 Lista Oficial Sub-Bots〙══╮\n\n║◉—⛩️ Puedes comunicarse con los Sub-Bots para que se unan a sus grupos\n\n║◉—⛩️ Si el texto aparece blanco significa que no hay Sub-Bots conectado\n\n║◉—⛩️ Cada Sub-Bots puede hacer lo que quiera, ShizukaBot-MD no se hace responsable\n\n║◉—⛩️ Sub-Bots Conectado : ${totalUsers || '0'}\n\n${replyMessage.trim()}`.trim();

  // Enviar mensaje con externalAdReply
  const imageURL = 'https://qu.ax/YlwSb.jpg'; // Miniatura de imagen externa
  const externalURL = 'https://whatsapp.com/channel/0029VaAN15BJP21BYCJ3tH04'; // URL externa

  await _envio.sendMessage(m.chat, {
    text: responseMessage,
    contextInfo: {
      mentionedJid: [m.sender], // Menciona al remitente
      externalAdReply: {
        title: '❑— Momo AyaseBot-MD —❑\nWʜᴀᴛꜱᴀᴘᴘ Bᴏᴛ - Mᴜʟᴛɪ Dᴇᴠɪᴄᴇ',
        body: `Sub-Bots conectados: ${totalUsers || '0'}`,
        thumbnailUrl: imageURL,
        sourceUrl: externalURL,
        mediaType: 1,
        renderLargerThumbnail: true,
      },
    },
  }, { quoted: m });
}

handler.command = handler.help = ['listjadibots', 'bots', 'subsbots'];
handler.tags = ['jadibot'];
export default handler;
