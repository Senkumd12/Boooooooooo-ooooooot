const handler = async (m, { conn }) => {
  const from = m.chat;

  // Crear los botones
  const buttons = [
    {
      buttonId: "boton1",
      buttonText: { displayText: "Botón 1" },
      type: 1,
    },
    {
      buttonId: "boton2",
      buttonText: { displayText: "Botón 2" },
      type: 1,
    },
  ];

  // Opciones del mensaje
  const buttonMessage = {
    text: "Test",
    footer: "Testing",
    buttons: buttons,
    headerType: 1, // Tipo de encabezado (6 para imagen, 1 para texto)
    viewOnce: true, // El mensaje solo puede ser visto una vez
  };

  // Enviar el mensaje
  await conn.sendMessage(from, buttonMessage, { quoted: m });
};

handler.help = ['testbuttons']; // Ayuda del comando
handler.tags = ['tools']; // Categoría
handler.command = /^testbuttons$/i; // Comando que activará el plugin

export default handler;
