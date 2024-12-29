let handler = async (m, { conn }) => {
  const texto = 'Este es un mensaje de prueba con botones.';
  const botones = [
    { buttonId: `.test1`, buttonText: { displayText: 'Botón 1' }, type: 1 },
    { buttonId: `.test2`, buttonText: { displayText: 'Botón 2' }, type: 1 },
  ];

  const buttonMessage = {
    text: texto,
    footer: 'YotsubaBot-MD 🍀',
    buttons: botones,
    headerType: 1,
  };

  await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
};

handler.help = ['botonprueba'];
handler.tags = ['test'];
handler.command = ['botonprueba']; // Comando para ejecutar el plugin
handler.register = false;

export default handler;
