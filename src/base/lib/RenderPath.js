const createPath2D = (points, close = false) => {
  const path = new Path2D();

  for (const point of points) {
    path.lineTo(...point);
  }
  if (close) {
    path.closePath();
  }
  return path;
};

/**
 * Encapsulates Path2D Init & render logic
 */
export default class RenderPath {
  /**
   * @param {Array<Array<number>>} pointArray
   * @param {boolean} closePath
   */
  constructor(pointArray, closePath = false) {
    this.closePath = closePath;
    this.points = pointArray;
  }

  set points(value) {
    this._points = value;
    this.path2d = createPath2D(value, this.closePath);
  }

  get points() {
    return this._points;
  }

  /**
   * Draws Path2D
   * @param {CanvasRenderingContext2D} ctx
   */
  stroke(ctx) {
    ctx.stroke(this.path2d);
  }

  /**
   * Draws Path2D
   * @param {CanvasRenderingContext2D} ctx
   */
  fill(ctx) {
    ctx.fill(this.path2d);
  }
}
