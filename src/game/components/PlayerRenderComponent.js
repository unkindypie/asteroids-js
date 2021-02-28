import vec2 from 'base/lib/vec2';
import Transform from 'base/lib/Transform';
import RenderPath from 'base/lib/RenderPath';
import MathUtils from 'base/lib/MathUtils';
import RenderComponent from 'base/components/RenderComponent';
import Entity from 'base/Entity';

export const playerVertexes = [
  [0, 3],
  [-3, 5],
  [0, -5],
  [3, 5],
];

export default class PlayerRenderComponent extends RenderComponent {
  /**
   * Creates RenderComponent
   * @param {CanvasRenderingContext2D} ctx
   */
  constructor(ctx) {
    super(ctx);
    this.transform = new Transform(new vec2(0, 0), new vec2(1, 1));
    this.path = new RenderPath(playerVertexes, true);
  }

  /**
   * @param {Entity} entity
   * @param {number} delta
   */
  update(entity, delta) {
    this.ctx.save();
    this.ctx.strokeStyle = 'white';

    // todo: move all transforms to one matrix
    this.transform.offset = new vec2(entity.position.x, entity.position.y);
    this.transform.translateCtx(this.ctx);
    this.ctx.rotate(entity.rotation * MathUtils.DEG_TO_RAD);

    this.path.stroke(this.ctx);

    this.ctx.restore();
  }

  receive({ type }) {}
}
