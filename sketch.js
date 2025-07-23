let paddle, ball, blocks = [];
let paddleImg, ballImg, blockImg, blockBrokenImg, bgImg;

function preload() {
  paddleImg = loadImage('assets/paddle.png');
  ballImg = loadImage('assets/ball.png');
  blockImg = loadImage('assets/block_normal.png');
  blockBrokenImg = loadImage('assets/block_broken_2.png');
  bgImg = loadImage('assets/background_2.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  paddle = new Paddle();
  ball = new Ball();
  createBlocks();
}

function draw() {
  background(bgImg);

  paddle.show();
  paddle.update();

  ball.show();
  ball.update();
  ball.checkPaddle(paddle);

  for (let b of blocks) {
    b.show();
    if (!b.broken && ball.hits(b)) {
      b.break();
      ball.dy *= -1;
    }
  }
}

function touchMoved() {
  // スマホ用：指を動かすとパドルが移動
  paddle.x = constrain(mouseX, 0, width - paddle.w);
  return false;
}

function createBlocks() {
  const rows = 4;
  const cols = 8;
  const blockW = width / cols;
  const blockH = 40;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      blocks.push(new Block(c * blockW, r * blockH, blockW, blockH));
    }
  }
}

class Paddle {
  constructor() {
    this.w = 100;
    this.h = 20;
    this.x = width / 2 - this.w / 2;
    this.y = height - 60;
  }

  show() {
    image(paddleImg, this.x, this.y, this.w, this.h);
  }

  update() {
    if (mouseIsPressed) {
      this.x = constrain(mouseX, 0, width - this.w);
    }
  }
}

class Ball {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.r = 15;
    this.dx = 5;
    this.dy = -5;
  }

  show() {
    image(ballImg, this.x - this.r, this.y - this.r, this.r * 2, this.r * 2);
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x < this.r || this.x > width - this.r) this.dx *= -1;
    if (this.y < this.r) this.dy *= -1;
    if (this.y > height) this.reset();
  }

  checkPaddle(paddle) {
    if (
      this.y + this.r > paddle.y &&
      this.x > paddle.x &&
      this.x < paddle.x + paddle.w
    ) {
      this.dy *= -1;
      this.y = paddle.y - this.r;
    }
  }

  hits(block) {
    return (
      !block.broken &&
      this.x > block.x &&
      this.x < block.x + block.w &&
      this.y - this.r < block.y + block.h &&
      this.y + this.r > block.y
    );
  }

  reset() {
    this.x = width / 2;
    this.y = height / 2;
    this.dx = 5;
    this.dy = -5;
  }
}

class Block {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.broken = false;
  }

  show() {
    if (!this.broken) {
      image(blockImg, this.x, this.y, this.w, this.h);
    } else {
      image(blockBrokenImg, this.x, this.y, this.w, this.h);
    }
  }

  break() {
    this.broken = true;
  }
}
