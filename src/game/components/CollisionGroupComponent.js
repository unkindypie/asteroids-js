import Component from 'base/Component';
import Entity from 'base/Entity';

export const collisionGroups = {
  player: 0,
  asteroid: 1,
};

export const collisionShapes = {
  rect: 0,
  circle: 1,
};

export default class CollisionGroupComponent extends Component {
  /**
   * @param {number} collisionGroup own collision group
   * @param {number} collisionShape
   */
  constructor(collisionGroup, collisionShape) {
    super();
    this.collisionGroup = collisionGroup;
    this.collisionShape = collisionShape;
  }

  /**
   * @param {Entity} entity
   * @param {number} delta
   */
  update(entity, delta) {}

  /**
   * @param {{type: number, data: any, entity: Entity}} message
   */
  receive({ type, data, entity }) {}
}
