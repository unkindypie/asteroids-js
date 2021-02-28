import vec2 from 'base/lib/vec2';

export default class Transform {
  /**
   *
   * @param {vec2} offset
   * @param {vec2} scale
   */
  constructor(offset, scale) {
    this.offset = offset;
    this._scale = scale;
    this._scaleDirty = true;
  }

  get scale() {
    return this._scale;
  }

  set scale(value) {
    this._scale = value;
    this._scaleDirty = true;
  }

  get isScaleDirty() {
    return this._scaleDirty;
  }

  /**
   * Applies transform to a given vector
   * @param {vec2} vec
   * @returns {vec2}
   */
  apply(vec) {
    const newVec = new vec2(
      vec.x * this.scale.x + this.offset.x,
      vec.y * this.scale.y + this.offset.y
    );
    return newVec;
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  translateCtx(ctx) {
    // ctx.resetTransform();
    // ctx.scale(this.scale.x, this.scale.y);
    ctx.translate(this.offset.x, this.offset.y);
  }
}
