/* 

❀ By JTxs

[ Canal Principal ] :
https://whatsapp.com/channel/0029VaeQcFXEFeXtNMHk0D0n

[ Canal Rikka Takanashi Bot ] :
https://whatsapp.com/channel/0029VaksDf4I1rcsIO6Rip2X

[ Canal StarlightsTeam] :
https://whatsapp.com/channel/0029VaBfsIwGk1FyaqFcK91S

[ HasumiBot FreeCodes ] :
https://whatsapp.com/channel/0029Vanjyqb2f3ERifCpGT0W
*/

// *[ ❀ YTMP4 ]*
import fetch from 'node-fetch'

let HS = async (m, { conn, command, text, usedPrefix }) => {
if (!text) return conn.reply(m.chat, '❀ ingresa un link de youtube', m)
//si borras creditos eri gei 👀
try {
let api = await fetch(`https://api.davidcyriltech.my.id/download/ytmp4?url=${text}`)
let json = await api.json()
let { title, quality, thumbnail, download_url } = json.result
await conn.sendMessage(m.chat, { video: { url: download_url }, caption: title }, { quoted: m })
} catch (error) {
console.error(error)
}}

HS.command = ['ytmp5']

export default HS
//Dejen creditos 👀 [ By Jtxs ] https://whatsapp.com/channel/0029Vanjyqb2f3ERifCpGT0W
