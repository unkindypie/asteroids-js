import vec2 from 'base/lib/vec2';
import Transform from 'base/lib/Transform';
import MathUtils from 'base/lib/MathUtils';
import RenderPath from 'base/lib/RenderPath';
import RenderComponent from 'base/components/RenderComponent';
import Entity from 'base/Entity';

const bulletVertexes = [
  [-0.5, -1],
  [0.5, -1],
  [0.5, 1],
  [-0.5, 1],
];

export default class BulletRenderComponent extends RenderComponent {
  /**
   * Creates RenderComponent
   * @param {CanvasRenderingContext2D} ctx
   */
  constructor(ctx) {
    super(ctx);
    this.transform = new Transform(new vec2(0, 0), new vec2(1, 1));
    this.path = new RenderPath(bulletVertexes, true);
  }

  /**
   * Abstract method for updating component state
   * @param {Entity} entity
   * @param {number} delta
   */
  update(entity, delta) {
    this.ctx.save();
    this.ctx.fillStyle = 'white';

    this.transform.offset = new vec2(entity.position.x, entity.position.y);
    this.transform.translateCtx(this.ctx);
    this.ctx.rotate(entity.rotation * MathUtils.DEG_TO_RAD);

    this.path.fill(this.ctx);

    this.ctx.restore();
  }

  receive({ type }) {}
}
