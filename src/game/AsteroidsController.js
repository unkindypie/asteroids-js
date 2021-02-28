import vec2 from 'base/lib/vec2';
import Transform from 'base/lib/Transform';
import Entity from 'base/Entity';
import EntityContainer from 'base/EntityContainer';
import MathUtils from 'base/lib/MathUtils';
import Rect from 'base/lib/Rect';

import AsteroidRenderComponent from 'game/components/AsteroidRenderComponent';
import ProjectileDynamicsComponent from 'game/components/ProjectileDynamicsComponent';
import AsteroidLogicComponent from 'game/components/AsteroidLogicComponent';
import CollisionGroupsComponent, {
  collisionGroups,
  collisionShapes,
} from 'game/components/CollisionGroupComponent';

const BASE_ASTEROID_VELOCITY = 10;
const MAX_ASTEROID_CLASS_VALUE = 3; // higher = smaller
const BASE_SPAWN_THRESHOLD = 7;
const SPAWN_THRESHOLD_SCALAR = 0.1;

/**
 * Controls spawning asteroids & making game fun
 */
export default class AsteroidsController {
  /**
   * @param {EntityContainer} container
   * @param {{toScreenTransform: Transform, toWorldTransform: Transform}} options dependencies of asteroid's components
   */
  constructor(container, { toScreenTransform, toWorldTransform, ctx }) {
    this.container = container;
    this.toScreenTransform = toScreenTransform;
    this.toWorldTransform = toWorldTransform;
    this.ctx = ctx;
  }

  init() {
    this.killedCount = 0;
    this.aliveCount = 0;

    const initialAsteroidsQuantity = MathUtils.randomInt(6, 8);

    for (let i = 0; i < initialAsteroidsQuantity; i++) {
      this.spawnAsteroid(
        this._getRandomSpawnPosition(),
        MathUtils.randomInt(1, MAX_ASTEROID_CLASS_VALUE + 1)
      );
    }
    // this.spawnAsteroid(new vec2(10, 10), 1, new vec2(0, 0));
    console.log(`${this.aliveCount} asteroids spawned.`);
  }

  /**
   * Spawns asteroid at position with random velocity direction
   * @param {vec2} position
   * @param {number} asteroidClass level/size of the asteroid (1 - 3), lower - larger
   */
  spawnAsteroid(position, asteroidClass = 1, velocity) {
    const asteroid = new Entity(
      new Rect(position, new vec2(20 / asteroidClass, 20 / asteroidClass), 0),
      [
        new ProjectileDynamicsComponent(
          velocity || this._getRandomVelocity(asteroidClass),
          Math.pow(MathUtils.randomInt(4, 6), asteroidClass)
        ),
        new AsteroidLogicComponent(this, asteroidClass),
        new AsteroidRenderComponent(
          this.ctx,
          this.toWorldTransform,
          1 / asteroidClass
        ),
        new CollisionGroupsComponent(
          collisionGroups.asteroid,
          collisionShapes.circle
        ),
      ]
    );
    this.container.add(asteroid);
    this.aliveCount++;
  }

  /**
   * increases killedCount and spawns new asteroids
   * @param {Entity} entity
   * @param {number} asteroidClass level/size of the asteroid (1 - 3), lower - larger
   */
  killAsteroid(entity, asteroidClass) {
    this.killedCount++;
    this.aliveCount--;

    for (
      let i = asteroidClass - 1;
      i <= MathUtils.randomInt(MAX_ASTEROID_CLASS_VALUE - asteroidClass, 3);
      i++
    ) {
      console.log('spawning with', asteroidClass - 1);
      this.spawnAsteroid(
        new vec2(
          entity.position.x + Math.random(),
          entity.position.y + Math.random()
        ),
        asteroidClass + 1
      );
    }
    this.container.remove(entity);

    if (
      this.aliveCount <
      BASE_SPAWN_THRESHOLD + this.killedCount * SPAWN_THRESHOLD_SCALAR
    ) {
      this.spawnAsteroid(
        this._getRandomSpawnPosition(),
        1,
        this._getRandomVelocity()
      );
    }
  }

  _getRandomSpawnPosition() {
    const spawnAxis = MathUtils.randomInt(0, 2);

    let position;
    if (spawnAxis) {
      position = new vec2(
        1,
        MathUtils.randomInt(1, this.container.worldDimensions.y)
      );
    } else {
      position = new vec2(
        MathUtils.randomInt(1, this.container.worldDimensions.x),
        1
      );
    }
    return position;
  }

  _getRandomVelocity(asteroidClass = 1) {
    // calculating random dir
    const randomAngle = MathUtils.randomNumber(0, 2 * Math.PI);
    return new vec2(
      Math.cos(randomAngle) * BASE_ASTEROID_VELOCITY * asteroidClass,
      Math.sin(randomAngle) * BASE_ASTEROID_VELOCITY * asteroidClass
    );
  }
}
