const figlet = require('figlet');
const { exec } = require('child_process');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const banner = "werbot";
const makeWASocket = require('@whiskeysockets/baileys').default;
const { generateWAMessageContent, generateWAMessageFromContent, proto } = require('@whiskeysockets/baileys');
const { WA_MESSAGE_TYPE, generateWAMessage } = require('@whiskeysockets/baileys');
//const { generateWAMessageFromContent } = require("@whiskeysockets/baileys");
const { useMultiFileAuthState, downloadMediaMessage } = require('@whiskeysockets/baileys');
const QRCode = require('qrcode-terminal');
const colors = require('colors');
const prefix = "_"; 

const respondedFile = path.join(__dirname, 'usernamesJid.json');
let respondedUsers = [];

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('sessao');

    const whmer = makeWASocket({
        auth: state,
        printQRInTerminal: true,
    });

    whmer.ev.on('creds.update', saveCreds);

    whmer.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            QRCode.generate(qr, { small: true });
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== 401;
            if (shouldReconnect) {
                startBot();
            }
        } else if (connection === 'open') {
            console.log('- Bot Werbot connected!'.green.bold);
        }
    });

     whmer.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message) return;
//        const linkserver = await waitForServerUy();
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
        const sender = msg.key.remoteJid;
        const jid = msg.key?.remoteJid || m.chat || sender;        
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        const usernameHelo = msg.pushName;

let groupMetadata, isGroupAdmin, participantes;

if (msg.key.remoteJid.endsWith('@g.us')) {
  try {
    groupMetadata = await whmer.groupMetadata(msg.key.remoteJid);
    isGroupAdmin = groupMetadata.participants.some(p => p.id === sender && p.admin);
    participantes = groupMetadata.participants;
  } catch (err) {
    console.error('Erro id group:', err);
  }
}

//        await handleMessage(whmer, msg);
//        await whmer.readMessages([msg.key]);
       console.log(msg);

try {
  if (fs.existsSync(respondedFile)) {
    respondedUsers = JSON.parse(fs.readFileSync(respondedFile, 'utf8'));
  }
} catch (err) {
  console.error('! Erro to loading usernames answered:'.red, err);
  respondedUsers = [];
}

function saveRespondedUser(jid) {
  if (!respondedUsers.includes(jid)) {
    respondedUsers.push(jid);
    fs.writeFileSync(respondedFile, JSON.stringify(respondedUsers, null, 2));
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function respondToUser(whmer, msg) {
 const jid = msg.key.remoteJid;
const usernameHelo = msg.pushName;
  const username = jid.split("@")[0];
        if (text.startsWith(prefix)) {
            const command = text.slice(1).trim().split(" ")[0];
            switch (command) {
        default:
//            await whmer.sendMessage(jid, { text: "" });
            break;
    }
}
    }

//    await respondToUser(whmer, msg);
});
}
startBot(); 
