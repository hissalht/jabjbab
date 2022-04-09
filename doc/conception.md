# Jabjab conception

Matchmaking is made through socket.io.

Actual gameplay networking uses WebRTC.

## Socket.io messages

```json
// sdp-offer
{
  "to": "some socket id",
  "offer": { ... }
}
```

```json
// sdp-anwser
{
  "to": "some socket id",
  "answer": { ... }
}
```

```json
// ice-candidate
{
  "to": "some socket id",
  "ice": { ... }
}
```

## Data channel messages

Data channel messages are JSON strings following the following format :

```json
{
  "type": "message type",
  "data": { ... }
}
```

```json
{
  "type": "ping",
  "data": null
}
```

```json
{
  "type": "pong",
  "data": null
}
```

```json
{
  "type": "ready"
}
```

```json
{
  "type": "inputs",
  "data": {
    "frame": 834,
    "inputs": {
      "left": false,
      "right": true,
      "up": false,
      "down": false,
      "a": false,
      "b": true
    }
  }
}
```
