import vec2 from 'base/lib/vec2';
import MathUtils from 'base/lib/MathUtils';
import Dimensions from 'base/lib/Dimensions';
import EntityContainer from 'base/EntityContainer';
import Entity from 'base/Entity';
import Component, { messages } from 'base/Component';
import { playerVertexes } from 'game/components/PlayerRenderComponent';
import RenderPath from 'base/lib/RenderPath';
import PlayerDynamicsComponent from 'game/components/PlayerDynamicsComponent';

export default class PlayerHealthComponent extends Component {
  /**
   * @param {number} initialHealth
   * @param {Function} onOutOfHealth
   * @param {CanvasRenderingContext2D} ctx
   * @param {vec2} worldSize
   */
  constructor(initialHealth, onOutOfHealth, ctx, worldSize) {
    super();
    this.health = initialHealth;
    this.onOutOfHealth = onOutOfHealth;
    this.ctx = ctx;
    this.worldSize = worldSize;
    this.path = new RenderPath(playerVertexes, true);
  }

  /**
   * @param {Entity} entity
   * @param {number} delta
   */
  update(entity, delta) {
    this.ctx.save();
    this.ctx.strokeStyle = 'white';
    this.ctx.scale(0.6, 0.6);
    const healthWidth = 0.05 * this.worldSize.x;
    const healthHeight = 0.05 * this.worldSize.y;
    this.ctx.translate(healthWidth, healthHeight);
    for (let i = 0; i < this.health; i++) {
      this.path.stroke(this.ctx);
      this.ctx.translate(healthWidth * 1.1, 0);
    }

    this.ctx.restore();
  }

  /**
   * @param {{type: number, data: any, entity: Entity}} message
   */
  receive({ type, data: { collidedEntity }, entity }) {
    switch (type) {
      case messages.COLLISION:
        console.log('player collision');
        this.health--;
        entity.position.x = this.worldSize.x / 2;
        entity.position.y = this.worldSize.y / 2;
        entity.rotation = 0;

        if (this.health <= 0) {
          this.onOutOfHealth();
        }
    }
  }
}
