// 有些变量并未提升，有需求时，再提出，比如移动速度和最远可见距离

/**
 * 绘制背景动画
 * @param {传递canvas标签元素} canvas
 * @param {绘制的点的个数} number
 * @param {背景颜色,默认为:rgb(35, 39, 65)} [backgroundColor="rgb(35, 39, 65)"]
 * @param {动画点的颜色,默认为:rgb(200,200,200)} [pointColor="rgb(200,200,200)"]
 * @param {连线的颜色，默认颜色:rgb(200,200,200)！！！线条颜色只接受rgb格式} [lineColor="rgb(200,200,200)"]
 */
export function background(
  canvas,
  number = 30,
  backgroundColor = "rgb(35, 39, 65)",
  pointColor = "rgb(200,200,200)",
  lineColor = "rgb(200,200,200)"
) {
  let pointStyle = pointColor || "rgb(200,200,200)"; // 使用逻辑或操作符来确保有默认值
  new Background(canvas, number, pointStyle, lineColor);
  // 检查backgroundColor是否为null或未定义，如果是，则使用默认值
  let bgStyleColor = backgroundColor || "rgb(35, 39, 65)"; // 使用逻辑或操作符来确保有默认值
  // 设置canvas的样式
  canvas.style = `position: fixed; top: 0; left: 0; background-color: ${bgStyleColor};`;
}

/**
 * 新建背景，传递canvas标签，点的个数，点的颜色，连线颜色即可创建动画
 */
class Background {
  constructor(canvas, number, pointColor, lineColor) {
    this.number = number;
    this.canvas = canvas;
    this.pointColor = pointColor;
    this.lineColor = lineColor;
    this.ctx = this.canvas.getContext("2d");
    this.init();
  }
  /**
   * 初始化背景的宽度和高度
   */
  init() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.graph = new Graph(
      this.canvas,
      this.ctx,
      this.number,
      this.pointColor,
      this.lineColor
    );
    this.graph.draw();
    this.graph.drawMousePoint();
  }
}
/**
 * 画出点和线
 */
class Graph {
  constructor(canvas, ctx, pointNumber, pointColor, lineColor) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.pointColor = pointColor;
    this.lineColor = lineColor;
    this.Points = new Array(pointNumber)
      .fill(0)
      .map(() => new Point(canvas, ctx, this.pointColor));
    this.mouse = false;
  }
  drawMousePoint() {
    window.addEventListener("mousemove", (e) => {
      if (this.mouse) {
        const mousePoint = this.Points[this.Points.length - 1];
        mousePoint.x = e.clientX;
        mousePoint.y = e.clientY;
      } else {
        // 如果不存在鼠标点，则创建一个新的
        this.Points.push(
          new MovePoint(
            this.canvas,
            this.ctx,
            this.pointColor,
            e.clientX,
            e.clientY
          )
        );
        console.log(this.Points);
        this.mouse = true;
      }
    });
    window.addEventListener("click", (e) => {
      this.Points.unshift(
        new Point(this.canvas, this.ctx, this.pointColor, e.clientX, e.clientY)
      );
    });
  }
  draw() {
    requestAnimationFrame(() => {
      this.draw();
    });
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.Points.length; i++) {
      const p1 = this.Points[i];
      p1.draw();
      for (let j = i + 1; j < this.Points.length; j++) {
        const p2 = this.Points[j];
        const line = new Line(this.ctx, p1.x, p1.y, p2.x, p2.y, this.lineColor);
        line.draw();
      }
    }
  }
}
class Line {
  /**
   *
   * @param {绘画上下文} ctx
   * @param {起点横坐标} startX
   * @param {起点纵坐标} startY
   * @param {终点横坐标} endX
   * @param {终点纵坐标} endY
   * @param {线的颜色} lineColor
   * @param {可以看到的最远距离，大于这个距离则不可见} maxDis
   */
  constructor(ctx, startX, startY, endX, endY, lineColor, maxDis = 400) {
    this.ctx = ctx;
    this.maxDis = maxDis;
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    // 验证lineColor是否为RGB格式
    if (!/^rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)$/.test(lineColor)) {
      throw new Error(
        'lineColor must be in RGB format (e.g., "rgb(255, 0, 0)")'
      );
    }
    this.lineColor = lineColor;
  }
  draw() {
    const dis = Math.sqrt(
      (this.startX - this.endX) ** 2 + (this.startY - this.endY) ** 2
    );
    const opacity = 1 - dis / this.maxDis; //透明度
    if (dis > 500) {
      return;
    }
    this.ctx.beginPath();
    this.ctx.moveTo(this.startX, this.startY);
    this.ctx.lineTo(this.endX, this.endY);
    // 解析RGB值并设置带有透明度的strokeStyle
    const rgbMatch = this.lineColor.match(/\d+/g);
    if (!rgbMatch || rgbMatch.length !== 3) {
      // 理论上这里不会执行，因为构造函数已经验证了格式
      throw new Error("Invalid RGB format in lineColor");
    }
    const [r, g, b] = rgbMatch.map(Number);
    this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    this.ctx.stroke();
  }
}
class MovePoint {
  constructor(canvas, ctx, pointColor, x, y) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.pointColor = pointColor;
    this.r = 4;
    this.x = x;
    this.y = y;
    this.lastDrawTime = null;
  }
  draw() {
    console.log("画鼠标点");
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    this.ctx.fillStyle = this.pointColor;
    this.ctx.fill();
  }
}
/**
 * 拿到canvas和ctx执行生成随机点
 */
class Point {
  constructor(canvas, ctx, pointColor, x, y) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.pointColor = pointColor;
    this.r = 4;
    this.x = x || getRandom(0, canvas.width - this.r / 2);
    this.y = y || getRandom(0, canvas.height - this.r / 2);
    this.xSpeed = getRandom(-50, 50);
    this.ySpeed = getRandom(-50, 50);
    this.lastDrawTime = null;
  }
  draw() {
    if (this.lastDrawTime) {
      //计算新坐标
      const duration = (Date.now() - this.lastDrawTime) / 1000;
      const xDis = this.xSpeed * duration;
      const yDis = this.ySpeed * duration;
      let x = this.x + xDis;
      let y = this.y + yDis;
      if (x > this.canvas.width - this.r / 2) {
        x = this.canvas.width - this.r / 2;
        this.xSpeed = -this.xSpeed;
      } else if (x < 0) {
        x = 0;
        this.xSpeed = -this.xSpeed;
      }
      if (y > this.canvas.height - this.r / 2) {
        y = this.canvas.height - this.r / 2;
        this.ySpeed = -this.ySpeed;
      } else if (y < 0) {
        y = 0;
        this.ySpeed = -this.ySpeed;
      }
      this.x = x;
      this.y = y;
    }
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    this.ctx.fillStyle = this.pointColor;
    this.ctx.fill();
    this.lastDrawTime = Date.now();
  }
}
/**
 * 生成随机数函数
 * @param {随机数最小值} min
 * @param {随机数最大值} max
 * @returns 返回一个介于min和max之间的随机数
 */
function getRandom(min, max) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
}
