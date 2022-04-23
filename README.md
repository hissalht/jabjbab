# jabjbab

**This is an extremely basic implementation. There are a few things that are not properly handled.**

This project is an example of using the _Web RTC API_ to implement rollback netcode in the browser.

It uses _socket.io_ to exchange RTC informations.

Once the P2P connection is established, the game uses bitECS to manage its game state.

The actual rollback netcode can be found in the [RollbackNetcodeSystem.ts](./app/src/game/ecs/systems/RollbackNetcodeSystem.ts) file.

## More about the stuff used in this project

- WebRTC API : https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API
- GGPO documentation : https://github.com/pond3r/ggpo/tree/master/doc
- Socket.io : https://socket.io/
- bitECS : https://github.com/NateTheGreatt/bitECS
