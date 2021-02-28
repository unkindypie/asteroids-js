import vec2 from 'base/lib/vec2';
import EnumNamingService from 'base/lib/EnumNamingService';
import Component from 'base/Component';

export const messages = {};
/**
 * Base DynamicsComponent interface
 */
export default class DynamicsComponent extends Component {
  /**
   * @param {vec2} velocity
   */
  constructor(velocity) {
    if (!velocity) throw new Error('ctx is required!');

    super();
    this.velocity = velocity;
  }
}
