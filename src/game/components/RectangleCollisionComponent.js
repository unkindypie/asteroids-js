import vec2 from 'base/lib/vec2';
import MathUtils from 'base/lib/MathUtils';
import EnumNamingService from 'base/lib/EnumNamingService';
import Component, { messages } from 'base/Component';
import EntityContainer from 'base/EntityContainer';
import Entity from 'base/Entity';

import CollisionGroupComponent, {
  collisionShapes,
} from 'game/components/CollisionGroupComponent';

export default class RectangleCollisionComponent extends Component {
  /**
   * @param {Array<number>} notifyOnCollisionWith
   */
  constructor(notifyOnCollisionWith) {
    super();
    this.notifyOnCollisionWith = notifyOnCollisionWith;
  }

  /**
   * @param {Entity} entity
   * @param {number} delta
   */
  update(entity, delta) {
    for (let otherEntity of entity.container.entities) {
      if (otherEntity === entity) continue;
      const group = otherEntity.getComponent(CollisionGroupComponent);

      if (
        group &&
        this.notifyOnCollisionWith.some(
          (observedGroup) => group.collisionGroup === observedGroup
        )
      ) {
        // circle collision
        if (
          group.collisionShape === collisionShapes.circle &&
          entity.rect.collidesWithCircle(
            otherEntity.position,
            otherEntity.rect.width
          )
        ) {
          entity.send({
            type: messages.COLLISION,
            data: {
              collidedEntity: otherEntity,
            },
          });
          otherEntity.send({
            type: messages.COLLISION,
            data: {
              collidedEntity: entity,
            },
          });
        }
      }
    }
  }

  /**
   * @param {{type: number, data: any, entity: Entity}} message
   */
  receive({ type, data, entity }) {}
}
