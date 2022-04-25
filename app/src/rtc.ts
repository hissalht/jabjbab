import { socket } from "./socket";

const conn = new RTCPeerConnection({
  iceServers: [
    {
      urls: ["stun:stun3.l.google.com:19302?transport=udp"],
    },
  ],
});
const sendChannel = conn.createDataChannel("sendChannel");
let receiveChannel: RTCDataChannel;

function onConnectionIceCandidate({ candidate }: RTCPeerConnectionIceEvent) {
  console.log(
    "🚀 ~ file: rtc.ts ~ line 7 ~ onConnectionIceCandidate ~ candidate",
    candidate
  );
  if (candidate) {
    socket.emit("ice-candidate", candidate);
  }
}

async function onSocketIceCandidate(candidate: RTCIceCandidate) {
  console.log(
    "🚀 ~ file: rtc.ts ~ line 14 ~ onSocketIceCandidate ~ candidate",
    candidate
  );
  await conn.addIceCandidate(candidate);
}

async function onSdpOffer(offer: any) {
  console.log("🚀 ~ file: rtc.ts ~ line 19 ~ onSdpOffer ~ offer", offer);
  await conn.setRemoteDescription(offer);
  const answer = await conn.createAnswer();
  await conn.setLocalDescription(answer);

  socket.emit("sdp-answer", answer);
  socket.on("ice-candidate", onSocketIceCandidate);
}

function onDatachannel({ channel }: RTCDataChannelEvent) {
  receiveChannel = channel;
  // receiveChannel.addEventListener("message", ({ data }) => {
  //   console.log("Received message from other player");
  //   console.log(data);
  // });
}

socket.on("sdp-offer", onSdpOffer);
conn.addEventListener("icecandidate", onConnectionIceCandidate);
conn.addEventListener("datachannel", onDatachannel);

sendChannel.addEventListener("open", () => {
  console.log("Receiver Data channel open");
});

export async function initiateConnection() {
  const offer = await conn.createOffer();
  await conn.setLocalDescription(offer);

  console.log("INITIATOR Emitting SDP offer");
  socket.emit("sdp-offer", offer);
  socket.on("ice-candidate", onSocketIceCandidate);

  socket.on("sdp-answer", async (answer) => {
    console.log("🚀 ~ file: rtc.ts ~ line 47 ~ socket.on ~ answer", answer);
    await conn.setRemoteDescription(answer);
  });
}

export function getSendChannel(): Promise<RTCDataChannel> {
  return new Promise((resolve) => {
    if (sendChannel.readyState === "open") {
      resolve(sendChannel);
    } else {
      sendChannel.addEventListener("open", () => {
        resolve(sendChannel);
      });
    }
  });
}

export function getReceiveChannel(): Promise<RTCDataChannel> {
  return new Promise((resolve) => {
    if (receiveChannel) {
      resolve(receiveChannel);
    } else {
      conn.addEventListener("datachannel", ({ channel }) => {
        resolve(channel);
      });
    }
  });
}
