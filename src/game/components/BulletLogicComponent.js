import vec2 from 'base/lib/vec2';
import MathUtils from 'base/lib/MathUtils';
import EnumNamingService from 'base/lib/EnumNamingService';
import Component, { messages } from 'base/Component';
import EntityContainer from 'base/EntityContainer';
import Entity from 'base/Entity';

export default class BulletLogicComponent extends Component {
  /**
   * @param {number} maxLifetime ms
   * @param {() => void} onHit
   */
  constructor(maxLifetime, onHit) {
    super();
    this.maxLifetime = maxLifetime;

    this.lifetime = 0;
    this.onHit = onHit;
  }

  /**
   * @param {Entity} entity
   * @param {number} delta
   */
  update(entity, delta) {
    this.lifetime += delta * 1000;
    if (this.lifetime > this.maxLifetime) {
      entity.container.remove(entity);
    }
  }

  /**
   * @param {{type: number, data: any, entity: Entity}} message
   */
  receive({ type, data, entity }) {
    switch (type) {
      case messages.COLLISION:
        if (entity.container) {
          entity.container.remove(entity);
        }
        this.onHit();
    }
  }
}
