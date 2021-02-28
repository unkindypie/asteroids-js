import vec2 from 'base/lib/vec2';
import MathUtils from 'base/lib/MathUtils';
import DynamicsComponent from 'base/components/DynamicsComponent';
import Entity from 'base/Entity';
import EntityContainer from 'base/EntityContainer';

import { messages } from 'game/components/PlayerInputComponent';

export default class ProjectileDynamicsComponent extends DynamicsComponent {
  /**
   * @param {vec2} velocity
   * @param {number} angularVelocity
   */
  constructor(velocity, angularVelocity = 0) {
    super(velocity);
    this.angularVelocity = angularVelocity;
  }

  /**
   * Moves entity
   * @param {Entity} entity
   * @param {number} delta
   */
  update(entity, delta) {
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
    entity.rotation += this.angularVelocity * delta;

    entity.position.x += this.velocity.x * delta;
    entity.position.y += this.velocity.y * delta;
  }

  receive({ type, data }) {}
}
