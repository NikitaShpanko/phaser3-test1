import Phaser from 'phaser';

const strokeWidth = 5;
const radius = 100;
const frictionAir = 0.2;
const bounce = 0.7;

let circle;
class MyGame extends Phaser.Scene {
  constructor() {
    super({
      physics: {
        default: 'matter',
        matter: {},
      },
    });
  }

  preload() {
    //this.load.image()
  }

  create() {
    const { width, height } = this.scale.gameSize;
    circle = this.add.circle(width / 2, height / 2, radius, 0xffffff);

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
    this.matter.world.setBounds(0, 0, width, height, 32);
    const circlePhysics = this.matter.add.gameObject(
      circle,
      {
        circleRadius: radius,
        frictionAir: frictionAir,
      },
      false,
    );
    circlePhysics.setBounce(bounce);

    //circlePhysics.setCollidesWith()
    //circlePhysics.setFrictionAir(0.05);
    // circlePhysics.setDensity()

    this.input.on('drag', (p, obj, dragX, dragY) => {
      //if (!obj.body) return;
      if (obj !== circle) return;
      circlePhysics.setVelocity(dragX - obj.x, dragY - obj.y);
      obj.setData('dragged', true);
    });

    this.input.on('dragstart', (p, obj) => {
      obj.setData('dragged', false);
    });
  }

  update(time, delta) {
    const { width, height } = this.scale.gameSize;
    //console.log(time);
    //if (time % 10) return;
    //console.log(circle.x, circle.y);
    if (circle.x < 0 || circle.x > width || circle.y < 0 || circle.y > height) {
      console.log(circle.x, circle.y);
      circle.x = width / 2;
      circle.y = height / 2;
    }
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
