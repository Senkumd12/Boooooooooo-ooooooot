const { default: fetch } = require('node-fetch');

module.exports = {
  name: "test1",
  alias: [],
  category: "general",
  desc: "Envía un mensaje con imagen y botones",
  async execute(conn, m, args) {
    try {
      const imageUrl = 'https://qu.ax/MFOVJ.jpg'; // Reemplaza con el enlace de tu imagen
      const buttons = [
        {
          buttonId: ".gay",
          buttonText: { displayText: "Si" },
          type: 1,
        },
        {
          buttonId: ".play2 felices los 4",
          buttonText: { displayText: "No" },
          type: 1,
        },
      ];

      const response = await fetch(imageUrl); // Obtiene la imagen desde la URL
      const buffer = await response.buffer();

      await conn.sendMessage(m.chat, {
        image: buffer, // Envía la imagen como buffer
        caption: "Eres gay?",
        footer: "Sock",
        buttons: buttons,
        headerType: 4,
        viewOnce: true,
      }, { quoted: m });

    } catch (err) {
      console.error(err);
      await conn.sendMessage(m.chat, { text: "Hubo un error al ejecutar el comando." }, { quoted: m });
    }
  },
};
