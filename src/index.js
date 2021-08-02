import Phaser from 'phaser';

const SPEED_FACTOR = 1;

class MyGame extends Phaser.Scene {
  constructor() {
    super({
      physics: {
        default: 'arcade',
        arcade: {},
      },
    });
  }

  preload() {
    //this.load.image()
  }

  create() {
    const strokeWidth = 5;
    const radius = 100;
    const { width, height } = this.scale.gameSize;
    const circle = this.physics.add.existing(
      this.add.circle(width / 2, height / 2, radius, 0xffffff),
    );
    circle.body.setBounce(1, 1);
    //circle.body.setDamping(true);
    circle.body.setCollideWorldBounds(true);

    circle.setStrokeStyle(strokeWidth);
    circle.strokeColor = 0xff0000;
    circle.isStroked = false;
    const shape = new Phaser.Geom.Circle(radius, radius, radius);

    circle.setInteractive(shape, Phaser.Geom.Circle.Contains);

    circle.on(
      'pointerup',
      () => {
        if (circle.getData('dragged')) return;
        const newColor = Phaser.Display.Color.RandomRGB();
        circle.fillColor = newColor.color;
        circle.strokeColor = newColor.saturate(100).lighten(100).color;
        circle.body.setVelocity(0, 0);
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

    this.input.on('drag', (p, obj, dragX, dragY) => {
      if (!obj.body) return;
      circle.body.setVelocity((dragX - obj.x) * SPEED_FACTOR, (dragY - obj.y) * SPEED_FACTOR);
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
