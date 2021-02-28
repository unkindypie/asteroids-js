import Component from 'base/Component';
import Transform from 'base/lib/Transform';

/**
 * Base RenderComponent interface
 */
export default class RenderComponent extends Component {
  /**
   * Creates RenderComponent
   * @param {CanvasRenderingContext2D} ctx
   */
  constructor(ctx) {
    if (!ctx) throw new Error('ctx is required!');
    super();

    this.ctx = ctx;
  }
}
