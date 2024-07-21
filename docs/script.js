const Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Body = Matter.Body,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Vector = Matter.Vector,
  Events = Matter.Events;

// エンジンの生成
const engine = Engine.create();
const canvas = document.getElementById('canvas-area');
const ctx1 = canvas.getContext('2d');
const outputCanvas = document.getElementById('triangleCanvas');
const ctx2 = outputCanvas.getContext('2d');
const world = engine.world;

function drawOnFirstCanvas() {
  const canvas1 = document.getElementById('canvas-area');
  const ctx1 = canvas1.getContext('2d');
  
  // 例として簡単な描画
  ctx1.fillStyle = 'blue';
  ctx1.fillRect(500, 500, 2000, 2000);

  // canvas-areaから画像データを取得
  const imageData = ctx1.getImageData(50, 50, 200, 200);
  
  // 二つ目のキャンバスに画像データを描画
  const canvas2 = document.getElementById('triangleCanvas');
  const ctx2 = canvas2.getContext('2d');
  ctx2.putImageData(imageData, 50, 50);
}

// ページが読み込まれた後に実行
window.onload = drawOnFirstCanvas;

// レンダリングの設定
const render = Render.create({
    canvas: canvas,
    outputCanvas: outputCanvas,
    engine: engine,
    options: {
      width: window.innerWidth,
      height: window.innerHeight,
      background: '#f0f0f0',
      wireframes: false,
    }
});

// マウス、マウス制約を生成
const mouse = Mouse.create(canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    render: {
      visible: false
    }
  }
});

Composite.add(engine.world, mouseConstraint);
render.mouse = mouse;
Render.run(render);
Runner.run(engine);

const circleRadius = 100;
const numberOfPoints = 60;
const points = [];

let delta = 0;

window.addEventListener('wheel', (event) => {
    delta += event.deltaY; 
    createPointsOnCircle(window.innerWidth - 150, 300, circleRadius, numberOfPoints, delta);
});

const createPointsOnCircle = (centerX, centerY, radius, numPoints, delta) => {
    // 既存の点を削除
    points.forEach(point => Composite.remove(world, point));
    points.length = 0; // 配列をリセット
  
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI + delta * 0.001; // スクロール量を利用して角度を調整
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      const point = Bodies.circle(x, y, 5, {
          friction:5,
          frictionStatic:5,
          isStatic: true,
          render: {
              frictionStatic:1,
              friction:1,
              fillStyle: "black",
              strokeStyle: "none"
          }
      });
      Composite.add(world, point);
      points.push(point);
      if (i === 0) {
          pointx1 = x;
          pointy1 = y;
      } else if (i === 20) {
          pointx2 = x;
          pointy2 = y;
      } else if (i === 40) {
          pointx3 = x;
          pointy3 = y;
      }
    }
    };

    function drawCanvas() {
      const canvas1 = document.getElementById('canvas-area');
      const ctx1 = canvas1.getContext('2d');
      const imageData = ctx1.getImageData(50, 50, 200, 200);
      
      // 二つ目のキャンバスに画像データを描画
      const canvas2 = document.getElementById('triangleCanvas');
      const ctx2 = canvas2.getContext('2d');
      ctx2.putImageData(imageData, 50, 50);
  }
  // ページが読み込まれた後に実行
  window.onload = drawCanvas;

createPointsOnCircle(window.innerWidth - 150, 300, circleRadius, numberOfPoints, delta);

window.addEventListener('resize', () => {
    render.options.width = window.innerWidth;
    render.options.height = window.innerHeight;
    Render.setPixelRatio(render, window.devicePixelRatio);
  
    createPointsOnCircle(window.innerWidth - 150, 300, circleRadius, numberOfPoints, delta);
  });
  

// 決定ボタン投下後のテキスト追加
document.getElementById('submit').addEventListener('click', () => {
    const inputText = document.getElementById('name').value;
    if (inputText) {
        textInCircle(inputText);
    }
});
function textInCircle(text) {
    const textObjects = [];
    const textArray = text.split('');
    const centerX = window.innerWidth - 110;
    const centerY = 300;

    textArray.forEach((char, index) => {
        const textBody = Bodies.rectangle(centerX, centerY, 40, 40, {
            render: {
                sprite: {
                    restitution:1,
                    friction: 1,
                    frictionStatic: 1,
                    texture: createTextTexture(char),
                    xScale: 0.5,
                    yScale: 0.5
                }
            }
        });
        textObjects.push(textBody);
        Composite.add(world, textBody);
    });

    constrainTextWithinCircle(textObjects, centerX, centerY, circleRadius);
}

// テキストをテクスチャに変換
function createTextTexture(text) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 100;
    canvas.height = 100;
    context.font = '60px myfont';
    context.fillText(text, 10, 50);
    return canvas.toDataURL();
}

// テキストを円の内側に配置
function constrainTextWithinCircle(textObjects, centerX, centerY, radius) {
    textObjects.forEach(body => {
      const distance = Vector.magnitude(Vector.sub(body.position, { x: centerX, y: centerY }));
      if (distance > radius) {
        const normal = Vector.normalise(Vector.sub(body.position, { x: centerX, y: centerY }));
        Body.setPosition(body, {
          x: centerX + normal.x * radius,
          y: centerY + normal.y * radius
        });
      }
    });
  }
  


