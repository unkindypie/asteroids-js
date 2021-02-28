import vec2 from 'base/lib/vec2';
import Transform from 'base/lib/Transform';
import MathUtils from 'base/lib/MathUtils';
import RenderPath from 'base/lib/RenderPath';
import RenderComponent from 'base/components/RenderComponent';
import Entity from 'base/Entity';

// todo: generate procedurally
const asteroidVertexes = [
  [-4, -10],
  [4, -10],
  [10, -4],
  [10, 4],
  [4, 10],
  [-4, 10],
  [-10, 4],
  [-10, -4],
  [-10, -4],
  [-4, -10],
];

export default class AsteroidRenderComponent extends RenderComponent {
  /**
   * Creates RenderComponent
   * @param {CanvasRenderingContext2D} ctx
   * @param {Transform} toWorldTransform
   * @param {number} scale x1 - 20 points
   */
  constructor(ctx, toWorldTransform, scale = 1) {
    super(ctx);
    this.transform = new Transform(new vec2(0, 0), new vec2(1, 1));
    this.path = new RenderPath(asteroidVertexes, false);
    this.scale = scale;
    this.toWorldTransform = toWorldTransform;
  }

  /**
   * Abstract method for updating component state
   * @param {Entity} entity
   * @param {number} delta
   */
  update(entity, delta) {
    this.ctx.save();
    this.ctx.strokeStyle = 'white';

    this.transform.offset = new vec2(entity.position.x, entity.position.y);
    this.transform.translateCtx(this.ctx);
    this.ctx.rotate(entity.rotation * MathUtils.DEG_TO_RAD);
    this.ctx.scale(this.scale, this.scale);
    // this.ctx.scale(
    //   this.toWorldTransform.scale.x / this.scale,
    //   this.toWorldTransform.scale.y / this.scale
    // );

    this.ctx.lineWidth = Math.min(
      this.toWorldTransform.scale.x / this.scale,
      this.toWorldTransform.scale.y / this.scale
    );
    this.path.stroke(this.ctx);

    this.ctx.restore();
  }

  receive({ type }) {}
}
