import vec2 from 'base/lib/vec2';
import MathUtils from 'base/lib/MathUtils';
import EntityContainer from 'base/EntityContainer';
import Entity from 'base/Entity';
import Component, { messages } from 'base/Component';
import AsteroidsController from 'game/AsteroidsController';
// import {dynamicsMessages} from 'base/components/DynamicsComponent'

export default class AsteroidLogicComponent extends Component {
  /**
   * @param {AsteroidsController} asteroidController
   * @param {number} asteroidClass
   */
  constructor(asteroidController, asteroidClass) {
    super();

    this.asteroidController = asteroidController;
    this.asteroidClass = asteroidClass;
  }

  /**
   * @param {Entity} entity
   * @param {number} delta
   */
  update(entity, delta) {}

  /**
   * @param {{type: number, data: {collidedEntity: Entity}, entity: Entity}} message
   */
  receive({ type, data: { collidedEntity }, entity }) {
    switch (type) {
      case messages.COLLISION: {
        this.asteroidController.killAsteroid(
          entity,
          this.asteroidClass,
          // asteroid parts will use this as velocity dir
          collidedEntity.rotation
        );
      }
    }
  }
}
