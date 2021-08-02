import Phaser from 'phaser';

const STROKE_WIDTH = 5;
const RADIUS = 100;
const FRICTION_AIR = 0.05;
const BOUNCE = 0.7;
const INIT_FILL_COLOR = 0xffffff;
const INIT_STROKE_COLOR = 0xff0000;

class MyGame extends Phaser.Scene {
  constructor() {
    super({
      physics: {
        default: 'matter',
        matter: {},
      },
    });
  }

  create() {
    const { width, height } = this.scale.gameSize;
    const circle = this.matter.add.gameObject(
      this.add.circle(width / 2, height / 2, RADIUS, INIT_FILL_COLOR),
      {
        circleRadius: RADIUS,
        frictionAir: FRICTION_AIR,
      },
      false,
    );

    circle.setStrokeStyle(STROKE_WIDTH);
    circle.strokeColor = INIT_STROKE_COLOR;
    circle.isStroked = false;

    circle.setInteractive(
      new Phaser.Geom.Circle(RADIUS, RADIUS, RADIUS),
      Phaser.Geom.Circle.Contains,
    );

    circle.on(
      'pointerup',
      () => {
        if (circle.getData('dragged')) return;
        const newColor = Phaser.Display.Color.RandomRGB();
        circle.fillColor = newColor.color;
        circle.strokeColor = newColor.saturate(100).lighten(100).color;
      },
      this,
    );

    circle.on('pointerover', () => {
      circle.isStroked = true;
    });

    circle.on('pointerout', () => {
      circle.isStroked = false;
    });

    this.input.setDraggable(circle);
    this.matter.world.disableGravity();
    this.matter.world.setBounds(0, 0, width, height, width + height);
    circle.setBounce(BOUNCE);

    this.input.on('drag', (p, obj, dragX, dragY) => {
      if (obj !== circle) return;
      circle.setVelocity(dragX - obj.x, dragY - obj.y);
      obj.setData('dragged', true);
    });

    this.input.on('dragstart', (p, obj) => {
      obj.setData('dragged', false);
    });
  }
}

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  scene: MyGame,
};
const game = new Phaser.Game(config);
console.log(game.scene);
