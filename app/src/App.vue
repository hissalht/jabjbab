<script setup lang="ts">
import { computed, ref, onUnmounted, nextTick } from "vue";
import { runGame } from "./game/Jabjab";
import { getReceiveChannel, getSendChannel, initiateConnection } from "./rtc";
import { socket } from "./socket";

const room = ref<string[]>();

function onRoomUpdate(data: { room: string; sockets: string[] }) {
  room.value = data.sockets;
}
socket.on("room-update", onRoomUpdate);
onUnmounted(() => {
  socket.removeListener("room-update", onRoomUpdate);
});

const isInitiator = computed(() => {
  return room.value?.at(0) === socket.id;
});

const connectionInitiated = ref(false);

function start() {
  console.log("Pouet");
  connectionInitiated.value = true;
  initiateConnection();
}

const connectionReady = ref(false);
const canvas = ref<HTMLCanvasElement>();

Promise.all([getSendChannel(), getReceiveChannel()]).then(
  async ([sendChannel, receiveChannel]) => {
    connectionReady.value = true;
    console.log("Transmission channels are ready");
    console.log({ sendChannel, receiveChannel });
    await nextTick();
    runGame({
      canvas: canvas.value!,
      receiveChannel,
      sendChannel,
      playerId: isInitiator.value ? 0 : 1,
    });
  }
);

const debugData = ref("ljsdflksdjf");
function updateDebugData() {
  // @ts-expect-error
  debugData.value = JSON.stringify(window._debug, null, 2);
  requestAnimationFrame(updateDebugData);
}
requestAnimationFrame(updateDebugData);
</script>

<template>
  <h1>Jab Jab</h1>
  <template v-if="connectionReady">
    <code>
      <pre>{{ debugData }}</pre>
    </code>
    <canvas width="800" height="600" ref="canvas" />
  </template>
  <template v-else>
    <p>Players in the room ({{ room?.length ?? 0 }} / 2) :</p>
    <ul v-if="room">
      <li v-for="player in room" :key="player">{{ player }}</li>
    </ul>
    <button
      :disabled="
        (room?.length ?? 0) !== 2 || !isInitiator || connectionInitiated
      "
      @click="start"
    >
      Start RTC connection
    </button>
    <p id="p0"></p>
    <p id="p1"></p>
  </template>
</template>

<style scoped>
canvas {
  border: 2px solid hsla(0deg, 0%, 50%, 0.5);
  max-width: calc(100% - 4px);
}
</style>
