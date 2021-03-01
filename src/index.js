import vec2 from 'base/lib/vec2';
import Rect from 'base/lib/Rect';
import Transform from 'base/lib/Transform';
import Entity from 'base/Entity';
import EntityContainer from 'base/EntityContainer';

import PlayerRenderComponent from 'game/components/PlayerRenderComponent';
import PlayerDynamicsComponent from 'game/components/PlayerDynamicsComponent';
import PlayerInputComponent from 'game/components/PlayerInputComponent';
import CannonComponent from 'game/components/CannonComponent';
import AsteroidController from 'game/AsteroidsController';
import { collisionGroups } from 'game/components/CollisionGroupComponent';
import PlayerHealthComponent from 'game/components/PlayerHealthComponent';
import RectangleCollisionComponent from 'game/components/RectangleCollisionComponent';

const SCORE_INCREMENT = 10;

export default class Game {
  constructor() {
    this.container = document.getElementById('content');
    this.canvas = document.getElementById('canvas');

    this.startScreen = document.getElementById('startScreen');
    this.inGameScreen = document.getElementById('inGameScreen');
    this.gameOverScreen = document.getElementById('gameOverScreen');
    this.inGameScore = document.getElementById('inGameScore');
    this.finalScore = document.getElementById('finalScore');

    this.ctx = this.canvas.getContext('2d');

    this.prevUpdateTime = 0;
    this.height = 0;
    this.width = 0;

    this.worldHeight = 150;
    this.worldWidth = 150;

    this.ctx.fillStyle = '#000';
    this.ctx.strokeStyle = 'white';

    // calculating transforms
    this.toWorldTransform = new Transform(
      new vec2(0, 0),
      new vec2(this.worldWidth / this.width, this.worldHeight / this.height)
    );
    this.toScreenTransform = new Transform(
      new vec2(0, 0),
      new vec2(this.width / this.worldWidth, this.height / this.worldHeight)
    );

    this.entityContainer = new EntityContainer(
      new vec2(this.worldWidth, this.worldHeight),
      this.ctx
    );

    // controls asteroids spawning
    this.asteroidController = new AsteroidController(this.entityContainer, {
      toScreenTransform: this.toScreenTransform,
      toWorldTransform: this.toWorldTransform,
      ctx: this.ctx,
    });

    this.init();
  }

  startGameHandler() {
    this.setGameState('game');
  }

  /**
   * @param {'game' | 'gameover'} state
   */
  setGameState(state) {
    switch (state) {
      case 'game':
        {
          this.startScreen.style.display = 'none';
          this.inGameScreen.style.display = 'flex';
          this.gameOverScreen.style.display = 'none';

          this.score = 0;
          this.player = this._createPlayer();
          this.entityContainer.reset();
          this.entityContainer.add(this.player);
          this.asteroidController.init();
        }
        break;
      case 'gameover': {
        this.startScreen.style.display = 'none';
        this.inGameScreen.style.display = 'none';
        this.gameOverScreen.style.display = 'flex';

        const flushedScore = this.score;
        this.finalScore.textContent = `YOUR SCORE: ${flushedScore}`;
        this.score = 0;
        this.entityContainer.remove(this.player);
      }
    }
  }

  init() {
    window.addEventListener('resize', () => this.onResize());
    this.onResize();
    this.startScreen.getElementsByTagName(
      'button'
    )[0].onclick = this.startGameHandler.bind(this);
    this.gameOverScreen.getElementsByTagName(
      'button'
    )[0].onclick = this.startGameHandler.bind(this);

    this.asteroidController.init();

    requestAnimationFrame((time) => this.update(time));
  }

  _createPlayer() {
    return new Entity(
      new Rect(
        new vec2(this.worldWidth / 2, this.worldHeight / 2),
        new vec2(6, 10),
        0
      ),
      [
        new PlayerInputComponent(this.toWorldTransform),
        new PlayerDynamicsComponent(),
        new CannonComponent({
          ctx: this.ctx,
          bulletVelocityScalar: 100,
          enemyCollisionGroups: [collisionGroups.asteroid],
          onHit: this._onEnemyHit.bind(this),
        }),
        new RectangleCollisionComponent([collisionGroups.asteroid]),
        new PlayerRenderComponent(this.ctx),
        new PlayerHealthComponent(
          5,
          () => {
            this.setGameState('gameover');
          },
          this.ctx,
          new vec2(this.worldWidth, this.worldHeight)
        ),
      ]
    );
  }

  onResize() {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.toWorldTransform.scale = new vec2(
      this.worldWidth / this.width,
      this.worldHeight / this.height
    );
    this.toScreenTransform.scale = new vec2(
      this.width / this.worldWidth,
      this.height / this.worldHeight
    );

    // for using world scaled world coordinated with ctx.scale
    this.ctx.lineWidth = Math.min(
      this.toWorldTransform.scale.x,
      this.toWorldTransform.scale.y
    );
    this.ctx.resetTransform();
    this.ctx.scale(
      this.toScreenTransform.scale.x,
      this.toScreenTransform.scale.y
    );
  }

  update(time) {
    this.ctx.fillRect(0, 0, this.width, this.height);

    // delta in seconds
    const dt = (time - this.prevUpdateTime) / 1000;
    this.prevUpdateTime = time;

    this.entityContainer.update(dt);

    requestAnimationFrame((time) => this.update(time));
  }

  _onEnemyHit() {
    this.score += SCORE_INCREMENT;
    this.inGameScore.textContent = `SCORE: ${this.score}`;
  }
}

new Game();
