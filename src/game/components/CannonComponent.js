import vec2 from 'base/lib/vec2';
import MathUtils from 'base/lib/MathUtils';
import Component from 'base/Component';
import { messages } from 'base/components/InputComponent';
import Entity from 'base/Entity';
import Rect from 'base/lib/Rect';

import ProjectileDynamicsComponent from 'game/components/ProjectileDynamicsComponent';
import BulletRenderComponent from 'game/components/BulletRenderComponent';
import RectangleCollisionComponent from 'game/components/RectangleCollisionComponent';
import BulletLogicComponent from 'game/components/BulletLogicComponent';

const SHOOTING_COOLDOWN = 300;
const BULLET_LIFETIME = 1300;

export default class CannonComponent extends Component {
  /**
   * @param {{
   *  ctx: CanvasRenderingContext2D,
   *  bulletVelocityScalar: number,
   *  enemyCollisionGroups: Array<number>
   *  onHit: () => void
   * }} options
   */
  constructor({ ctx, bulletVelocityScalar, enemyCollisionGroups, onHit }) {
    super();
    this.lastShoot = 0;
    this.ctx = ctx;
    this.bulletVelocityScalar = bulletVelocityScalar;
    this.enemyCollisionGroups = enemyCollisionGroups;
    this.onHit = onHit;
  }

  /**
   * @param {Entity} entity
   * @param {number} delta
   */
  update(entity, delta) {
    if (this.isShooting && Date.now() - this.lastShoot > SHOOTING_COOLDOWN) {
      const bullet = this._createBullet(entity);
      entity.container.add(bullet);
      // // todo: пихнути в компонент
      // setTimeout(() => {
      //   entity.container.remove(bullet);
      // }, BULLET_LIFETIME);
      this.lastShoot = Date.now();
    }
  }

  _createBullet(entity) {
    return new Entity(
      new Rect(entity.position.clone(), new vec2(1, 2), entity.rotation),
      [
        new ProjectileDynamicsComponent(
          new vec2(
            Math.cos((entity.rotation - 90) * MathUtils.DEG_TO_RAD) *
              this.bulletVelocityScalar,
            Math.sin((entity.rotation - 90) * MathUtils.DEG_TO_RAD) *
              this.bulletVelocityScalar
          )
        ),
        new RectangleCollisionComponent(this.enemyCollisionGroups),
        new BulletLogicComponent(BULLET_LIFETIME, this.onHit),
        new BulletRenderComponent(this.ctx),
      ]
    );
  }

  /**
   * @param {{type: number, data: any, entity: Entity}} message
   */
  receive({ type, data, entity }) {
    switch (type) {
      case messages.SHOOT:
        this.isShooting = data;
    }
  }
}
