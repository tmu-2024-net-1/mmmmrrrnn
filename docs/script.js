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
const world = engine.world;

// レンダリングの設定
const render = Render.create({
    canvas: canvas,
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

    points.forEach(point => Composite.remove(world, point));
    points.length = 0; 
  
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI + delta * 0.001; // スクロール量を利用して角度を調整
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      const point = Bodies.circle(x, y, 5, {
          friction: 5,
          frictionStatic: 5,
          isStatic: true,
          render: {
              frictionStatic: 1,
              friction: 1,
              fillStyle: "black",
              strokeStyle: "none"
          }
      });
      Composite.add(world, point);
      points.push(point);
    }
};

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
                    restitution: 1,
                    friction: 1,
                    frictionStatic: 1,
                    texture: createTextTexture(char),
                    xScale: 0.5,
                    yScale: 0.5,
                }
            }
        });
        const offset = 20 * index - (textArray.length - 1) * 10; // 調整された位置
        Body.translate(textBody, { x: offset, y: 0 });
        Composite.add(world, textBody);
        textObjects.push(textBody);
    });

    return textObjects;
}

function createTextTexture(text) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 100;
  canvas.height = 100;
  context.font = '60px myfont';
  context.fillText(text, 10, 50);
  return canvas.toDataURL();
}

document.getElementById('screenshot-btn').addEventListener('click', () => {
  const centerX = window.innerWidth - 150;
  const centerY = 300;
  const radius = circleRadius;
  const x1 = centerX - radius;
  const y1 = centerY - radius;    
  const width = radius * 2;
  const height = radius * 2;

  html2canvas(document.body, {//スクショ所得
      x: x1,
      y: y1,
      width: width,
      height: height,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
  }).then(canvas => {
      const imgData = canvas.toDataURL();
      const img = new Image();
      img.src = imgData;

      const triangleCanvas = document.getElementById('triangleCanvas');
      const triangleCtx = triangleCanvas.getContext('2d');
      triangleCanvas.width = 1000; 
      triangleCanvas.height = 1000;
      triangleCtx.clearRect(0, 0, triangleCanvas.width, triangleCanvas.height);
      
      
      const x1 = triangleCanvas.width/2
      const y1 = 0;
      const x2 = triangleCanvas.width/12;
      const y2 = triangleCanvas.height*19/24;
      const x3 = triangleCanvas.width/12 *11;
      const y3 = triangleCanvas.height *19/24;
      triangleCtx.beginPath();
            triangleCtx.moveTo(x1, y1); 
            triangleCtx.lineTo(x2, y2); 
            triangleCtx.lineTo(x3, y3); 
            triangleCtx.closePath(); 

            triangleCtx.clip();

            img.onload = () => {//三角形にクリップした領域に画像を描写
              triangleCtx.drawImage(img, 0, 0, triangleCanvas.width, triangleCanvas.height, );
          };
  });
//
  const triangleCanvas2 = document.getElementById('triangleCanvas2');
  const triangleCtx2 = triangleCanvas2.getContext('2d');
  triangleCanvas2.width = 1000; 
  triangleCanvas2.height = 1000;
  triangleCtx2.drawImage(document.getElementById('triangleCanvas'), 0, 0);

  triangleCanvas2.style.position = "absolute";
  triangleCanvas2.style.left = "250px";
  triangleCanvas2.style.top = "0px";

  const triangleCanvas3 = document.getElementById('triangleCanvas3');
  const triangleCtx3 = triangleCanvas3.getContext('2d');
  triangleCanvas3.width = 1000; 
  triangleCanvas3.height = 1000;
  triangleCtx3.drawImage(document.getElementById('triangleCanvas'), 0, 0);

  triangleCanvas3.style.position = "absolute";
  triangleCanvas3.style.left = "500px";
  triangleCanvas3.style.top = "0px";

  const triangleCanvas4 = document.getElementById('triangleCanvas4');
  const triangleCtx4 = triangleCanvas4.getContext('2d');
  triangleCanvas4.width = 1000; 
  triangleCanvas4.height = 1000;
  triangleCtx4.drawImage(document.getElementById('triangleCanvas'), 0, 0);

  triangleCanvas4.style.position = "absolute";
  triangleCanvas4.style.left = "125px";
  triangleCanvas4.style.top = "-50px";

  const triangleCanvas5 = document.getElementById('triangleCanvas5');
  const triangleCtx5 = triangleCanvas5.getContext('2d');
  triangleCanvas5.width = 1000; 
  triangleCanvas5.height = 1000;
  triangleCtx5.drawImage(document.getElementById('triangleCanvas'), 0, 0);

  triangleCanvas5.style.position = "absolute";
  triangleCanvas5.style.left = "375px";
  triangleCanvas5.style.top = "-45px";

  const triangleCanvas6 = document.getElementById('triangleCanvas6');
  const triangleCtx6 = triangleCanvas6.getContext('2d');
  triangleCanvas6.width = 1000; 
  triangleCanvas6.height = 1000;
  triangleCtx6.drawImage(document.getElementById('triangleCanvas'), 0, 0);

  triangleCanvas6.style.position = "absolute";
  triangleCanvas6.style.left = "0px";
  triangleCanvas6.style.top = "120px";

  const triangleCanvas7 = document.getElementById('triangleCanvas7');
  const triangleCtx7 = triangleCanvas7.getContext('2d');
  triangleCanvas7.width = 1000; 
  triangleCanvas7.height = 1000;
  triangleCtx7.drawImage(document.getElementById('triangleCanvas'), 0, 0);

  triangleCanvas7.style.position = "absolute";
  triangleCanvas7.style.left = "250px";
  triangleCanvas7.style.top = "120px";

  const triangleCanvas8 = document.getElementById('triangleCanvas8');
  const triangleCtx8 = triangleCanvas8.getContext('2d');
  triangleCanvas8.width = 1000; 
  triangleCanvas8.height = 1000;
  triangleCtx8.drawImage(document.getElementById('triangleCanvas'), 0, 0);

  triangleCanvas8.style.position = "absolute";
  triangleCanvas8.style.left = "500px";
  triangleCanvas8.style.top = "120px";

  const triangleCanvas9 = document.getElementById('triangleCanvas9');
  const triangleCtx9 = triangleCanvas9.getContext('2d');
  triangleCanvas9.width = 1000; 
  triangleCanvas9.height = 1000;
  triangleCtx9.drawImage(document.getElementById('triangleCanvas'), 0, 0);

  triangleCanvas9.style.position = "absolute";
  triangleCanvas9.style.left = "125px";
  triangleCanvas9.style.top = "160px";

  const triangleCanvas10 = document.getElementById('triangleCanvas10');
  const triangleCtx10 = triangleCanvas10.getContext('2d');
  triangleCanvas10.width = 1000; 
  triangleCanvas10.height = 1000;
  triangleCtx10.drawImage(document.getElementById('triangleCanvas'), 0, 0);

  triangleCanvas10.style.position = "absolute";
  triangleCanvas10.style.left = "375px";
  triangleCanvas10.style.top = "160px";

  const triangleCanvas11 = document.getElementById('triangleCanvas11');
  const triangleCtx11 = triangleCanvas11.getContext('2d');
  triangleCanvas11.width = 1000; 
  triangleCanvas11.height = 1000;
  triangleCtx11.drawImage(document.getElementById('triangleCanvas'), 0, 0);

  triangleCanvas11.style.position = "absolute";
  triangleCanvas11.style.left = "0px";
  triangleCanvas11.style.top = "320px";

  const triangleCanvas12 = document.getElementById('triangleCanvas12');
  const triangleCtx12 = triangleCanvas12.getContext('2d');
  triangleCanvas12.width = 1000; 
  triangleCanvas12.height = 1000;
  triangleCtx12.drawImage(document.getElementById('triangleCanvas'), 0, 0);

  triangleCanvas12.style.position = "absolute";
  triangleCanvas12.style.left = "250px";
  triangleCanvas12.style.top = "320px";

  const triangleCanvas13 = document.getElementById('triangleCanvas13');
  const triangleCtx13 = triangleCanvas13.getContext('2d');
  triangleCanvas13.width = 1000; 
  triangleCanvas13.height = 1000;
  triangleCtx13.drawImage(document.getElementById('triangleCanvas'), 0, 0);

  triangleCanvas13.style.position = "absolute";
  triangleCanvas13.style.left = "500px";
  triangleCanvas13.style.top = "320px";

  const triangleCanvas14 = document.getElementById('triangleCanvas14');
  const triangleCtx14 = triangleCanvas14.getContext('2d');
  triangleCanvas14.width = 1000; 
  triangleCanvas14.height = 1000;
  triangleCtx14.drawImage(document.getElementById('triangleCanvas'), 0, 0);

  triangleCanvas14.style.position = "absolute";
  triangleCanvas14.style.left = "125px";
  triangleCanvas14.style.top = "275px";

  const triangleCanvas15 = document.getElementById('triangleCanvas15');
  const triangleCtx15 = triangleCanvas15.getContext('2d');
  triangleCanvas15.width = 1000; 
  triangleCanvas15.height = 1000;
  triangleCtx15.drawImage(document.getElementById('triangleCanvas'), 0, 0);

  triangleCanvas15.style.position = "absolute";
  triangleCanvas15.style.left = "375px";
  triangleCanvas15.style.top = "275px";

  const triangleCanvas16 = document.getElementById('triangleCanvas16');
  const triangleCtx16 = triangleCanvas16.getContext('2d');
  triangleCanvas16.width = 1000; 
  triangleCanvas16.height = 1000;
  triangleCtx16.drawImage(document.getElementById('triangleCanvas'), 0, 0);

  triangleCanvas16.style.position = "absolute";
  triangleCanvas16.style.left = "0px";
  triangleCanvas16.style.top = "440px";

  const triangleCanvas17 = document.getElementById('triangleCanvas17');
  const triangleCtx17 = triangleCanvas17.getContext('2d');
  triangleCanvas17.width = 1000; 
  triangleCanvas17.height = 1000;
  triangleCtx17.drawImage(document.getElementById('triangleCanvas'), 0, 0);

  triangleCanvas17.style.position = "absolute";
  triangleCanvas17.style.left = "250px";
  triangleCanvas17.style.top = "440px";

  const triangleCanvas18 = document.getElementById('triangleCanvas18');
  const triangleCtx18 = triangleCanvas18.getContext('2d');
  triangleCanvas18.width = 1000; 
  triangleCanvas18.height = 1000;
  triangleCtx18.drawImage(document.getElementById('triangleCanvas'), 0, 0);

  triangleCanvas18.style.position = "absolute";
  triangleCanvas18.style.left = "500px";
  triangleCanvas18.style.top = "440px";

  const triangleCanvas19 = document.getElementById('triangleCanvas19');
  const triangleCtx19 = triangleCanvas19.getContext('2d');
  triangleCanvas19.width = 1000; 
  triangleCanvas19.height = 1000;
  triangleCtx19.drawImage(document.getElementById('triangleCanvas'), 0, 0);

  triangleCanvas19.style.position = "absolute";
  triangleCanvas19.style.left = "125px";
  triangleCanvas19.style.top = "485px";

  const triangleCanvas20 = document.getElementById('triangleCanvas20');
  const triangleCtx20 = triangleCanvas20.getContext('2d');
  triangleCanvas20.width = 1000; 
  triangleCanvas20.height = 1000;
  triangleCtx20.drawImage(document.getElementById('triangleCanvas'), 0, 0);

  triangleCanvas20.style.position = "absolute";
  triangleCanvas20.style.left = "375px";
  triangleCanvas20.style.top = "485px";

//
});

// 決定ボタン投下後のテキスト追加とスクリーンショットボタンの表示
document.getElementById('submit').addEventListener('click', () => {
  const inputText = document.getElementById('name').value;
  if (inputText) {
      textInCircle(inputText);
      // スクリーンショットボタンを表示
      document.getElementById('screenshot-btn').style.display = 'block';
      document.getElementById('button-text').style.display = 'block';
  }
});

function reloadPage() {
  location.reload();
}


