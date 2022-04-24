# Jabjab state machine

I'm thinking about representing the various states a character can be in using a state machine. The transitions would be conditions required to go the next state, for example : to go from `IDLE` to `WALK_FORWARD`, the condition is to press the forward direction.

Here's the state diagram for a simple fighting game in which the player can

- walk
- neutral jump
- neutral double jump
- ground attack
- ground special attack

```mermaid
stateDiagram-v2
  IDLE --> WALK_FORWARD: Forward
  IDLE --> WALK_BACKWARD: Back
  IDLE --> NEUTRAL_JUMP: Up
  IDLE --> NORMAL_ATTACK_START: Attack
  IDLE --> SPECIAL_ATTACK_START: Special Attack

  WALK_FORWARD --> IDLE: Neutral
  WALK_FORWARD --> NEUTRAL_JUMP: Up
  WALK_FORWARD --> WALK_BACKWARD: Back
  WALK_FORWARD --> NORMAL_ATTACK_START: Attack
  WALK_FORWARD --> SPECIAL_ATTACK_START: Special Attack

  WALK_BACKWARD --> IDLE: Neutral
  WALK_BACKWARD --> NEUTRAL_JUMP: Up
  WALK_BACKWARD --> WALK_FORWARD: Forward
  WALK_BACKWARD --> NORMAL_ATTACK_START: Attack
  WALK_BACKWARD --> SPECIAL_ATTACK_START: Special Attack

  NEUTRAL_JUMP --> IDLE: Landing
  NEUTRAL_JUMP --> DOUBLE_NEUTRAL_JUMP: Up

  DOUBLE_NEUTRAL_JUMP --> IDLE: Landing

  NORMAL_ATTACK_START --> NORMAL_ATTACK_ACTIVE
  NORMAL_ATTACK_ACTIVE --> NORMAL_ATTACK_RECOVER
  NORMAL_ATTACK_RECOVER --> IDLE
  NORMAL_ATTACK_RECOVER --> SPECIAL_ATTACK_START: Special cancel

  SPECIAL_ATTACK_START --> SPECIAL_ATTACK_ACTIVE
  SPECIAL_ATTACK_ACTIVE --> SPECIAL_ATTACK_RECOVER
  SPECIAL_ATTACK_RECOVER --> IDLE
```
