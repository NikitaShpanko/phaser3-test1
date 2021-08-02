import Phaser from 'phaser';

class MyGame extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    //this.load.image()
  }

  create() {
    const strokeWidth = 5;
    const radius = 100;
    const { width, height } = this.scale.gameSize;
    const circle = this.add.circle(width / 2, height / 2, radius, 0xffffff);
    circle.setStrokeStyle(strokeWidth);
    circle.strokeColor = 0xff0000;
    circle.isStroked = false;
    const shape = new Phaser.Geom.Circle(radius, radius, radius);
    circle.setInteractive(shape, Phaser.Geom.Circle.Contains);
    circle.on(
      'pointerup',
      () => {
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
