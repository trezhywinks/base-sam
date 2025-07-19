//const figlet = require('figlet');
//const { exec } = require('child_process');
//const fs = require('fs');
///const axios = require('axios');
//const path = require('path');
//const banner = "werbot";
//const makeWASocket = require('@whiskeysockets/baileys').default;
//const { generateWAMessageContent, generateWAMessageFromContent, proto } = require('@whiskeysockets/baileys');
//const { WA_MESSAGE_TYPE, generateWAMessage } = require('@whiskeysockets/baileys');
//const { useMultiFileAuthState, downloadMediaMessage } = require('@whiskeysockets/baileys');
//const QRCode = require('qrcode-terminal');
//const colors = require('colors');
//const prefix = "_"; 

const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode-terminal');
const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
require('colors');

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

        if (qr) QRCode.generate(qr, { small: true });

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== 401;
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log('- Bot Werbot connected!'.green.bold);
        }
    });

    whmer.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message) return;
        if (msg.key.fromMe) return;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
        const sender = msg.key.remoteJid;
        const jid = sender;
        const usernameHelo = msg.pushName;

        let groupMetadata, isGroupAdmin, participantes;

        if (sender.endsWith('@g.us')) {
            try {
                groupMetadata = await whmer.groupMetadata(sender);
                isGroupAdmin = groupMetadata.participants.some(p => p.id === sender && p.admin);
                participantes = groupMetadata.participants;
            } catch (err) {
                console.error('Erro ao obter metadata do grupo:', err);
            }
        }

        try {
            if (fs.existsSync(respondedFile)) {
                respondedUsers = JSON.parse(fs.readFileSync(respondedFile, 'utf8'));
            }
        } catch (err) {
            console.error('Erro ao carregar respondedUsers:'.red, err);
            respondedUsers = [];
        }

        function saveRespondedUser(jid) {
            if (!respondedUsers.includes(jid)) {
                respondedUsers.push(jid);
                fs.writeFileSync(respondedFile, JSON.stringify(respondedUsers, null, 2));
            }
        }

        async function respondToUser() {
            const username = jid.split("@")[0];

            if (text === "oi") {
                await whmer.sendMessage(jid, { text: "hello" }, {quoted: msg});
            } else if (text === "hi") {
                await whmer.sendMessage(sender, { text: "Hi there!" });
            } else if (text === "bye") {
                await whmer.sendMessage(sender, { text: "Goodbye!" });
            } else {
                await whmer.sendMessage(sender, { text: "I didn't understand that." });
            }
        }

        const prefix = "!";
        if (text.startsWith(prefix)) {
            const command = text.slice(1).trim().split(" ")[0];

            switch (command) {
                case "mig":
                    await whmer.sendMessage(jid, { text: "test" }, { quoted: msg });
                    break;

                case "winksg": {
                    const quoted = msg.message?.extendedTextMessage?.contextInfo;

                    if (!quoted?.quotedMessage) {
                        await whmer.sendMessage(sender, { text: "❌ Erro: Nenhuma mensagem citada" }, { quoted: msg });
                        return;
                    }

                    const quotedMsg = quoted.quotedMessage;
                    const quotedType = Object.keys(quotedMsg)[0];
                    const participant = quoted.participant || msg.participant || msg.key.participant;
                    const userId = participant.replace(/@s\.whatsapp\.net/, "");
                    const casename = `user_${userId}`;
                    const content = JSON.stringify(quotedMsg, null, 2);

                    const generatedCase = `
case '${casename}': {
  await whmer.relayMessage(jid, {
    viewOnceMessage: {
      message: ${content}
    }
  }, {});
}
break;`;

                    await whmer.sendMessage(sender, {
                        text: `\n\n\`\`\`js\n${generatedCase}\n\`\`\``
                    }, { quoted: msg });
                    break;
                }

            }
        } else {
            await respondToUser();
        }
    });
}

startBot();
