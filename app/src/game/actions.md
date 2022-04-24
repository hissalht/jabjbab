# Jabjab state machine

I'm thinking about representing the various states a character can be in using a state machine. The transitions would be conditions required to go the next state, for example : to go from `IDLE` to `WALK_FORWARD`, the condition is to press the forward direction.

Here's the state diagram for a simple fighting game in which the player can

- walk
- normal attack
- special attack
- cancel normal attack recovery into special attack
- get hit

```mermaid
stateDiagram-v2
  IDLE --> WALK_FORWARD: Forward
  IDLE --> WALK_BACKWARD: Back
  IDLE --> NORMAL_ATTACK_START: Attack
  IDLE --> SPECIAL_ATTACK_START: Special Attack
  IDLE --> HITSTUN: Get hit
  IDLE --> BLOCKSTUN: Get hit

  WALK_FORWARD --> IDLE: Neutral
  WALK_FORWARD --> WALK_BACKWARD: Back
  WALK_FORWARD --> NORMAL_ATTACK_START: Attack
  WALK_FORWARD --> SPECIAL_ATTACK_START: Special Attack
  WALK_FORWARD --> HITSTUN: Get hit
  WALK_FORWARD --> BLOCKSTUN: Get hit

  WALK_BACKWARD --> IDLE: Neutral
  WALK_BACKWARD --> WALK_FORWARD: Forward
  WALK_BACKWARD --> NORMAL_ATTACK_START: Attack
  WALK_BACKWARD --> SPECIAL_ATTACK_START: Special Attack
  WALK_BACKWARD --> HITSTUN: Get hit
  WALK_BACKWARD --> BLOCKSTUN: Get hit

  NORMAL_ATTACK_START --> NORMAL_ATTACK_ACTIVE
  NORMAL_ATTACK_START --> HITSTUN: Get hit

  NORMAL_ATTACK_ACTIVE --> NORMAL_ATTACK_RECOVER
  NORMAL_ATTACK_ACTIVE --> HITSTUN: Get hit

  NORMAL_ATTACK_RECOVER --> IDLE: Wait
  NORMAL_ATTACK_RECOVER --> HITSTUN: Get hit
  NORMAL_ATTACK_RECOVER --> SPECIAL_ATTACK_START: Special cancel

  SPECIAL_ATTACK_START --> SPECIAL_ATTACK_ACTIVE
  SPECIAL_ATTACK_START --> HITSTUN: Get hit

  SPECIAL_ATTACK_ACTIVE --> SPECIAL_ATTACK_RECOVER
  SPECIAL_ATTACK_ACTIVE --> HITSTUN: Get hit

  SPECIAL_ATTACK_RECOVER --> IDLE: Wait
  SPECIAL_ATTACK_RECOVER --> HITSTUN: Get hit

  HITSTUN --> IDLE: Wait
  HITSTUN --> HITSTUN: Get hit again

  BLOCKSTUN --> IDLE: Wait
  BLOCKSTUN --> BLOCKSTUN: Get hit again
```
