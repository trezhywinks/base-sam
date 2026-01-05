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
const prefix = "_"; 

const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode-terminal');
const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const colors = require('colors');
const ownerNumber = '@s.whatsapp.net'; 

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
//        if (msg.key.fromMe) return;
        if (msg.key.remoteJid.endsWith('@g.us')) return; 
if (msg.key.participant !== ownerNumber && msg.key.remoteJid !== ownerNumber) return;
console.log(msg.key.remoteJid, msg.message)
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
const jid = msg.key.remoteJid;
const sender = msg.key.participant || msg.key.remoteJid;
//        const sender = msg.key.remoteJid;
  //      const jid = sender;
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

const waitMinutes = (minutes) => {
  return new Promise(resolve => setTimeout(resolve, minutes * 60 * 1000));
};

            if (text === "Bom dia") {
                await waitMinutes(1);
                await whmer.sendMessage(jid, { text: "Bom dia, tudo bem?" }, {quoted: msg});
            } else if (text === "Me ajude"){
  await whmer.relayMessage(jid, {
    viewOnceMessage: {
      message: {
        audioMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7117-24/34708575_1015428643837215_1875731300479456592_n.enc?ccb=11-4&oh=01_Q5Aa2AElnCwAtmP07FsPeHMNYD-B6CQ4CuizMknE4B0k1XgXpg&oe=68A61BAD&_nc_sid=5e03e0&mms3=true",
          mimetype: "audio/ogg; codecs=opus",
          fileSha256: "76Tgu+RJgwpZOxWsp59tUWjXcat25EcXMIYgduJYEwg=",
          fileLength: "9684",
          seconds: 4,
          ptt: true,
          mediaKey: "9iFtb3yM6EAFnRhxfjiH83buLr0LRiYu5FQpSRCIkJY=",
          fileEncSha256: "t+KTpR5/bAbSb0z1NJJehb8yUKDXEZI+lKVmMisULV8=",
          directPath: "/v/t62.7117-24/34708575_1015428643837215_1875731300479456592_n.enc?ccb=11-4&oh=01_Q5Aa2AElnCwAtmP07FsPeHMNYD-B6CQ4CuizMknE4B0k1XgXpg&oe=68A61BAD&_nc_sid=5e03e0&_nc_hot=1753129171",
          mediaKeyTimestamp: "1753129115",
          contextInfo: {
//            forwardingScore: 1,
  //          isForwarded: true,
            expiration: 86400,
            ephemeralSettingTimestamp: "1744026913",
            disappearingMode: {
              initiator: "CHANGED_IN_CHAT",
              trigger: "CHAT_SETTING",
              initiatedByMe: true
            }
          },
          streamingSidecar: "",
          waveform: "AAAAABErSEgwOEM+OEQSSEE3JRZBQkNDEQAEFyJHRjYpFEpLPxUxOCAYLD1ERkU4Nj4+LiwGAAAAAAAGBAAAFA=="
        }
      }
    }
  }, {});

            } else if (text === "hey 😊") {  
           await whmer.relayMessage(jid, {
  viewOnceMessage: {
    message: {
      audioMessage: {
        url: "https://mmg.whatsapp.net/v/t62.7117-24/24246459_1380841082991042_3091890028029932317_n.enc?ccb=11-4&oh=01_Q5Aa2AHiHJZd2rPLAhu_cHg4sGja0DuSIvETYFRHALZ0GcA-og&oe=68A35AA8&_nc_sid=5e03e0&mms3=true",
        mimetype: "audio/ogg; codecs=opus",
        fileSha256: "+IN4UT+xczzoHSUXHtGWJdkhS861q67R/YdWroQo1a8=",
        fileLength: "6109",
        seconds: 2,
        ptt: true,    
        mediaKey: "ix92kDGddCzgnV4pk6weuudKaFoiVK3ZUFUnjYphpug=",
        fileEncSha256: "2s+N29T2XSkc4KIfJ1TRsJYIKB3fTWDnBYM8YfySNwE=",
        directPath: "/v/t62.7117-24/24246459_1380841082991042_3091890028029932317_n.enc?ccb=11-4&oh=01_Q5Aa2AHiHJZd2rPLAhu_cHg4sGja0DuSIvETYFRHALZ0GcA-og&oe=68A35AA8&_nc_sid=5e03e0&_nc_hot=1752951688",
        mediaKeyTimestamp: "1752951648",
        contextInfo: {
//          forwardingScore: 1,
  //        isForwarded: true,
          expiration: 86400,
          ephemeralSettingTimestamp: "1744026913",
          disappearingMode: {
            initiator: "INITIATED_BY_OTHER",
            trigger: "ACCOUNT_SETTING",
            initiatedByMe: false
          }
        },
        streamingSidecar: "",
        waveform: "AgAAAAAGCAsUFBgcHhgUDwwPHzZLS09TVFJQTU1OT05LSEZFRUM+ODg4NjEqHhILDgoLDQ8WEw8VERAOCgIAAA=="
      }
    }
  }
}, {});
 
             } else if (text === "hi") {
                await whmer.sendMessage(sender, { text: "Hi there!" });
            } else if (text === "nullguuuuuuy") {
  await whmer.relayMessage(jid, {
    viewOnceMessage: {
      message: {
        audioMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7114-24/23420417_1927934617958357_7695984079254341623_n.enc?ccb=11-4&oh=01_Q5Aa2AG6IeY6RIdmOCraz6v1hcNEW7352Ltm6rW_bwHtQDGAqw&oe=68A25883&_nc_sid=5e03e0&mms3=true",
          mimetype: "audio/ogg; codecs=opus",
          fileSha256: "998JqdeluCiGZO4K77O1U8jhKCvmtUho/TWJ+gF1kb4=",
          fileLength: "9754",
          seconds: 4,
          ptt: true,
          mediaKey: "P+VcX1BZ7Hs2SPwfH2TTP5Esij7HFlUdRXBkr/ox9xg=",
          fileEncSha256: "knyIW1pTfwHPd9Bc90w6IkSE84xQXrEUKWweKHiWKHw=",
          directPath: "/v/t62.7114-24/23420417_1927934617958357_7695984079254341623_n.enc?ccb=11-4&oh=01_Q5Aa2AG6IeY6RIdmOCraz6v1hcNEW7352Ltm6rW_bwHtQDGAqw&oe=68A25883&_nc_sid=5e03e0&_nc_hot=1752944466",
          mediaKeyTimestamp: "1752885206",
          contextInfo: {
            expiration: 86400,
            ephemeralSettingTimestamp: "1744026913",
            disappearingMode: {
              initiator: "INITIATED_BY_OTHER",
              trigger: "ACCOUNT_SETTING",
              initiatedByMe: false
            }
          },
          streamingSidecar: "JK++ylAe3v2dUQ==",
          waveform: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="
        }
      }
    }
  }, {})

            }
        }

        const prefix = "!";
        if (text.startsWith(prefix)) {
            const command = text.slice(1).trim().split(" ")[0];

            switch (command) {


case 'ogguser': {
  await whmer.relayMessage(jid, {
    viewOnceMessage: {
      message: {
        audioMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7114-24/23420417_1927934617958357_7695984079254341623_n.enc?ccb=11-4&oh=01_Q5Aa2AG6IeY6RIdmOCraz6v1hcNEW7352Ltm6rW_bwHtQDGAqw&oe=68A25883&_nc_sid=5e03e0&mms3=true",
          mimetype: "audio/ogg; codecs=opus",
          fileSha256: "998JqdeluCiGZO4K77O1U8jhKCvmtUho/TWJ+gF1kb4=",
          fileLength: "9754",
          seconds: 4,
          ptt: true,
          mediaKey: "P+VcX1BZ7Hs2SPwfH2TTP5Esij7HFlUdRXBkr/ox9xg=",
          fileEncSha256: "knyIW1pTfwHPd9Bc90w6IkSE84xQXrEUKWweKHiWKHw=",
          directPath: "/v/t62.7114-24/23420417_1927934617958357_7695984079254341623_n.enc?ccb=11-4&oh=01_Q5Aa2AG6IeY6RIdmOCraz6v1hcNEW7352Ltm6rW_bwHtQDGAqw&oe=68A25883&_nc_sid=5e03e0&_nc_hot=1752944466",
          mediaKeyTimestamp: "1752885206",
          contextInfo: {
            expiration: 86400,
            ephemeralSettingTimestamp: "1744026913",
            disappearingMode: {
              initiator: "INITIATED_BY_OTHER",
              trigger: "ACCOUNT_SETTING",
              initiatedByMe: false
            }
          },
          streamingSidecar: "JK++ylAe3v2dUQ==",
          waveform: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="
        }
      }
    }
  }, {});
  break;
}

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
