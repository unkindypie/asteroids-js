import vec2 from 'base/lib/vec2';
import MathUtils from 'base/lib/MathUtils';
import DynamicsComponent from 'base/components/DynamicsComponent';
import { messages } from 'base/Component';
import Entity from 'base/Entity';

import { messages as playerInputMessages } from 'game/components/PlayerInputComponent';

const MAX_VELOCITY = 60;
const ANGULAR_OFFSET = 170;
const ACCELERATION = 2;
// космос терпкий )0))
const FRICTION = 0.01;

export default class PlayerDynamicsComponent extends DynamicsComponent {
  /**
   * @param {vec2} velocity
   */
  constructor(velocity = new vec2(0, 0)) {
    super(velocity);
    this.angularVelocity = 0;
  }

  /**
   * Moves entity
   * @param {Entity} entity
   * @param {number} delta
   */
  update(entity, delta) {
    // todo: add entity.dimensions and check for them
    if (entity.position.x > entity.container.worldDimensions.x) {
      entity.position.x = 0;
    }
    if (entity.position.y > entity.container.worldDimensions.y) {
      entity.position.y = 0;
    }
    if (entity.position.x < 0) {
      entity.position.x = entity.container.worldDimensions.x;
    }
    if (entity.position.y < 0) {
      entity.position.y = entity.container.worldDimensions.y;
    }

    // rotation
    if (this.rightPressed) {
      this.angularVelocity = ANGULAR_OFFSET;

      // console.log(entity.rect.toString(), entity.position);
    } else if (this.leftPressed) {
      this.angularVelocity = -ANGULAR_OFFSET;

      // console.log(entity.rect.toString(), entity.position);
    } else {
      this.angularVelocity = 0;
    }

    entity.rotation = (entity.rotation + this.angularVelocity * delta) % 360;

    // movement

    if (this.upPressed) {
      // this.velocity.x +=
      //   Math.cos((entity.rotation - 90) * DEG_TO_RAD) * ACCELERATION;
      // this.velocity.y +=
      //   Math.sin((entity.rotation - 90) * DEG_TO_RAD) * ACCELERATION;

      const computedVelocityX =
        this.velocity.x +
        Math.cos((entity.rotation - 90) * MathUtils.DEG_TO_RAD) * ACCELERATION;
      const computedVelocityY =
        this.velocity.y +
        Math.sin((entity.rotation - 90) * MathUtils.DEG_TO_RAD) * ACCELERATION;

      // 3*10^8m/s-speed-protection(c)
      if (Math.abs(computedVelocityX) < MAX_VELOCITY) {
        this.velocity.x = computedVelocityX;
      }

      if (Math.abs(computedVelocityY) < MAX_VELOCITY) {
        this.velocity.y = computedVelocityY;
      }
    } else {
      // slowing down
      this.velocity.x -= this.velocity.x * FRICTION;
      this.velocity.y -= this.velocity.y * FRICTION;
    }

    entity.position.x += this.velocity.x * delta;
    entity.position.y += this.velocity.y * delta;
  }

  receive({ type, data }) {
    switch (type) {
      case playerInputMessages.MOVE_LEFT:
        this.leftPressed = data;
        break;
      case playerInputMessages.MOVE_RIGHT:
        this.rightPressed = data;
        break;
      case playerInputMessages.MOVE_UP:
        this.upPressed = data;
        break;
      case messages.COLLISION:
        this.velocity = new vec2(0, 0);
    }
  }
}
