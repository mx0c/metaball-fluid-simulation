var Engine = Matter.Engine,
World = Matter.World,
Bodies = Matter.Bodies,
Mouse = Matter.Mouse,
Events = Matter.Events,
Common = Matter.Common,
Body = Matter.Body;

Matter.use('matter-attractors');

var w = 650, h = 700;
var res = 10, threshold = 3, halfRes = res / 2;
let cols = w / res + 1, rows = h / res + 1;
var engine, world;
var balls = [];
var obstacles = [];
var attractor;
var minParticleSize = 10;
var maxParticleSize = 20;
var showParticles = false, lerpEnabled = true;
var particleAmt = 50;
var attractorGravity = 0;
var mouse;
var data = []

function setup() {
    var canvas = createCanvas(w, h);
    canvas.parent("canvas")
    engine = Engine.create();
    world = engine.world;
    obstacles.push(new Box(w/2, 0, w, 15));
    obstacles.push(new Box(w/2, h, w, 15));
    obstacles.push(new Box(0, 0, 15, h*2));
    obstacles.push(new Box(w, 0 , 15, h*2));
    obstacles.push(new Box(w/2, h/2 - 50, w/2, 100, PI / 4 ));
    World.add(world, obstacles);
     
    mouse = Mouse.create(canvas.elt) 
    mouse.pixelRatio = pixelDensity();
   
    //init 2d array
    for(let i = 0; i < rows; i++){
      data[i] = []
    }

    attractor = Matter.Bodies.circle(width/2, height/2, 20, {
      plugin: {
        attractors: [function(bodyA, bodyB) {
          return {
            x: (bodyA.position.x - bodyB.position.x) * attractorGravity,
            y: (bodyA.position.y - bodyB.position.y) * attractorGravity,
          };
        }]
      }
    });
    World.add(world,attractor)

    initParticles();
    setupUi();
  }

  function mousePressed() {
    attractorGravity = 1e-6
    world.gravity.scale = 0;
  }

  function mouseDragged() {
      Body.translate(attractor, {
        x: (mouse.position.x - attractor.position.x) * 0.25,
        y: (mouse.position.y - attractor.position.y) * 0.25
    });
  }

  function mouseReleased() {
    world.gravity.scale = 0.001
    attractorGravity = 0;
  }

function draw() {
  Engine.update(engine);
  background(255)

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let y = j * res;
      let x = i * res;
      data[i][j] = getMetaballDistance(x,y);
    }
  }

  for (let i = 0; i < cols - 1; i++) {
    for (let j = 0; j < rows - 1; j++) {
      let y = j * res;
      let x = i * res;

      let a_value = data[i][j]
      let b_value = data[i+1][j]
      let c_value = data[i+1][j+1]
      let d_value = data[i][j+1]

      let state = convertToDec(a_value,b_value,c_value,d_value)
      if(state == 0) continue;

      let amt = (threshold - a_value) / (b_value - a_value);
      let a = createVector(lerpEnabled ? lerp(x, x+res, amt) : x + halfRes, y);

      amt = (threshold - b_value) / (c_value - b_value);
      let b = createVector(x + res, lerpEnabled ? lerp(y, y+res, amt) : y + halfRes);  
      
      amt = (threshold - d_value) / (c_value - d_value);
      let c = createVector(lerpEnabled ? lerp(x, x+res, amt) : x + halfRes, y + res);

      amt = (threshold - a_value) / (d_value - a_value);
      let d = createVector(x, lerpEnabled ? lerp(y, y+res, amt) : y + halfRes);
             
      drawSquareState(state, a, b, c, d, x, y) 
    } 
  }
  for (ball of balls) {
    ball.update();
    if(showParticles) ball.show();
  }
  for(obstacle of obstacles){
    obstacle.show();
  }
  showFps()
}

function drawSquareState(state, a, b, c, d, x, y){
  fill(0)
  switch (state) {
    case 1:
      triangle(c.x, c.y, d.x, d.y, x, y+res)
      break;
    case 2:
      triangle(b.x, b.y,c.x, c.y,x+res, y+res)
      break;
    case 3:
      beginShape()
      vertex(b.x, b.y)
      vertex(d.x, d.y) 
      vertex(x, y + res)
      vertex(x + res, y + res)
      endShape()
      break;
    case 4:
      triangle(a.x,a.y,b.x,b.y, x+res,y)
      break;
    case 5:
      beginShape()
      vertex(a.x, a.y)
      vertex(d.x, d.y)
      vertex(x,y+res)
      vertex(c.x,c.y)
      vertex(b.x,b.y)
      vertex(x+res,y)
      endShape()
      break;
    case 6:
      beginShape()
      vertex(a.x,a.y)
      vertex(c.x,c.y)
      vertex(x+res,y+res)
      vertex(x+res,y)
      endShape()
      break;
    case 7:
      beginShape()
      vertex(a.x,a.y)
      vertex(d.x,d.y)
      vertex(x,y+res)
      vertex(x+res,y+res)
      vertex(x+res,y)
      endShape()
      break;
    case 8:
      triangle(a.x,a.y,d.x,d.y,x,y)
      break;
    case 9:
      beginShape();
      vertex(a.x,a.y)
      vertex(c.x,c.y)
      vertex(x,y+res)
      vertex(x,y)
      endShape()
      break;
    case 10:
      beginShape()
      vertex(a.x,a.y)
      vertex(b.x,b.y)
      vertex(x+res,y+res)
      vertex(c.x,c.y)
      vertex(d.x,d.y)
      vertex(x,y)
      endShape()
      break;
    case 11:
      beginShape()
      vertex(a.x,a.y)
      vertex(b.x,b.y)
      vertex(x+res,y+res)
      vertex(x,y+res)
      vertex(x,y)
      endShape()
      break;
    case 12:
      beginShape()
      vertex(b.x,b.y)
      vertex(d.x,d.y)
      vertex(x,y)
      vertex(x+res,y)
      endShape()
      break;
    case 13:
      beginShape()
      vertex(b.x,b.y)
      vertex(c.x,c.y)
      vertex(x,y+res)
      vertex(x,y)
      vertex(x+res,y)
      endShape()
      break;
    case 14:
      beginShape()
      vertex(c.x,c.y)
      vertex(d.x,d.y)
      vertex(x,y)
      vertex(x+res,y)
      vertex(x+res,y+res)
      endShape()
      break;
    case 15:
      rect(x, y, res, res);
      break;
  }
}

function showFps(){
  textSize(15);
  fill(0)
  noStroke()
  text(parseInt(frameRate()) + " FPS", w-64, 32);
}

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

$("#resolution").change(()=>{
  res = $("#resolution").val()
  halfRes = res / 2;
  cols = w / res + 1, rows = h / res + 1;
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
