var Engine = Matter.Engine,
World = Matter.World,
Bodies = Matter.Bodies,
Mouse = Matter.Mouse,
Events = Matter.Events,
MouseConstraint = Matter.MouseConstraint;

var w=650, h=700;
var res = 10, threshold = 3, halfRes = res / 2;
let cols = w / res + 1, rows = h / res + 1;
var engine, world, mMouseConstraint;
var balls = [];
var ground, left, right, top, obstacle;
var minParticleSize = 5;
var maxParticleSize = 20;
var showParticles = false, showGrid = false, lerpEnabled = true;
var particleAmt = 50;
var data = []

function setup() {
    var canvas = createCanvas(w, h);
    canvas.parent("canvas")
    engine = Engine.create();
    world = engine.world;
    top = Bodies.rectangle(w/2, 0, w, 100, { isStatic: true });
    ground = Bodies.rectangle(w/2, h, w, 100, { isStatic: true });
    left = Bodies.rectangle(0, 0, 100, h*2, { isStatic: true });
    right = Bodies.rectangle(w, 0, 100, h*2, { isStatic: true });
    obstacle = Bodies.rectangle(w/2, h/2, w/2, 200, { isStatic: true, angle: PI / 4 });
    World.add(world, [top,ground,left,right]);
     
    var mouse = Mouse.create(canvas.elt) 
    mouse.pixelRatio = pixelDensity();
    var options = 
    mMouseConstraint = MouseConstraint.create(engine, { mouse:mouse })
    World.add(world, mMouseConstraint);
   
    //init 2d array
    for(let i = 0; i < rows; i++){
      data[i] = []
    }

    initParticles();
    setupUi();
  }

function draw() {
  Engine.update(engine);
  background(255)
  for (ball of balls) {
      ball.update();
      if(showParticles) ball.show();
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let y = j * res;
      let x = i * res;

      data[i][j] = getMetaballDistance(x,y);
    }
  }

  fill(40);
  for (let i = 0; i < cols-1; i++) {
    for (let j = 0; j < rows-1; j++) {
      let y = j * res;
      let x = i * res;

      showGrid ? drawGrid(i, j) : null

      let a_value = data[i][j]
      let b_value = data[i+1][j]
      let c_value = data[i+1][j+1]
      let d_value = data[i][j+1]

      let amt = (threshold - a_value) / (b_value - a_value);
      let a = createVector(lerpEnabled ? lerp(x, x+res, amt) : x + halfRes, y);

      amt = (threshold - b_value) / (c_value - b_value);
      let b = createVector(x + res, lerpEnabled ? lerp(y, y+res, amt) : y + halfRes);  
      
      amt = (threshold - d_value) / (c_value - d_value);
      let c = createVector(lerpEnabled ? lerp(x, x+res, amt) : x + halfRes, y + res);

      amt = (threshold - a_value) / (d_value - a_value);
      let d = createVector(x, lerpEnabled ? lerp(y, y+res, amt) : y + halfRes);
             
      let state = convertToDec(a_value,b_value,c_value,d_value)
      drawSquareState(state, a, b, c, d) 
    } 
  }
  showFps()
}

function drawSquareState(state, a, b, c, d){
  stroke(0);
  switch (state) {
    case 1:
      drawLine(c, d);
      break;
    case 2:
      drawLine(b, c);
      break;
    case 3:
      drawLine(b, d);
      break;
    case 4:
      drawLine(a, b);
      break;
    case 5:
      drawLine(a, d);
      drawLine(b, c);
      break;
    case 6:
      drawLine(a, c);
      break;
    case 7:
      drawLine(a, d);
      break;
    case 8:
      drawLine(a, d);
      break;
    case 9:
      drawLine(a, c);
      break;
    case 10:
      drawLine(a, b);
      drawLine(c, d);
      break;
    case 11:
      drawLine(a, b);
      break;
    case 12:
      drawLine(b, d);
      break;
    case 13:
      drawLine(b, c);
      break;
    case 14:
      drawLine(c, d);
      break;
  }
}

function showFps(){
  textSize(15);
  fill(0)
  noStroke()
  text(parseInt(frameRate()) + " FPS", w-64, 32);
}

//buildSubTree (lowX, lowY, len){
//  If (lowX, lowY) is out of range: Return a leaf node with {∞,∞}
//2. If len = 1: Return a leaf node with {min, max} of corner values
//3. Else
//1. c1 = buildSubTree (lowX, lowY, len/2)
//2. c2 = buildSubTree (lowX + len/2, lowY, len/2)
//3. c3 = buildSubTree (lowX, lowY + len/2, len/2)
//4. c4 = buildSubTree (lowX + len/2, lowY + len/2, len/2)
//5. Return a node with children {c1,…,c4} and {min, max} of all
//{min, max} of these children
//}

$("#display-particles").click(()=>{
  showParticles = $("#display-particles").is(':checked')
})

$("#display-grid").click(()=>{
  showGrid = $("#display-grid").is(':checked');
})

$("#particle-amount").change(()=>{
  particleAmt = $("#particle-amount").val()
  initParticles()
})

$("#threshold").change(()=>{
  threshold = $("#threshold").val()
})

$("#max-size").change(()=>{
  maxParticleSize = parseInt($("#max-size").val())
  initParticles()
})

$("#min-size").change(()=>{
  minParticleSize = parseInt($("#min-size").val())
  initParticles()
})

$("#lerp").change(()=>{
  lerpEnabled = $("#lerp").is(':checked')
})

function initParticles(){
  for (const ball of balls) {
    World.remove(world, ball.body)
  }
  balls = []
  console.log(minParticleSize, maxParticleSize)
  for (let i = 0; i < particleAmt; i++) {
      balls.push(new Ball(random(0,w), random(80,100), random(minParticleSize, maxParticleSize)));
  }
}

function setupUi(){
  $("#max-size").val(maxParticleSize)
  $("#min-size").val(minParticleSize)
  $("#resolution").val(res)
  $("#threshold").val(threshold)
  $("#particle-amount").val(particleAmt)
  $("#lerp").prop('checked', lerpEnabled);
}

function drawGrid(i, j){
      noFill()
      stroke(200)
      rect(i*res, j*res, res, res);
}

function convertToDec(a,b,c,d){
    let state = ""
    state += a > threshold ? "1" : "0";
    state += b > threshold ? "1" : "0";
    state += c > threshold ? "1" : "0";
    state += d > threshold ? "1" : "0";
    return parseInt(state,2)
}

function drawLine(v1, v2) {
    line(v1.x, v1.y, v2.x, v2.y);
}

function getMetaballDistance(x, y){
    let sum = 0;
    for (const ball of balls) {
      sum += ball.r ** 2 / ((ball.x-x) ** 2  + (ball.y-y) ** 2);
    }
    return sum
}