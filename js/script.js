var Engine = Matter.Engine,
World = Matter.World,
Bodies = Matter.Bodies,
Mouse = Matter.Mouse,
Events = Matter.Events,
MouseConstraint = Matter.MouseConstraint;

var w=700, h=700;
var res = 10, threshold = 2.5
let cols = w / res, rows = h / res;
var engine, world, mMouseConstraint;
var balls = [];
var ground, left, right, top;
var maxParticleSize = 5;
var minParticleSize = 20;

function setup() {
    var canvas = createCanvas(w, h);
    engine = Engine.create();
    world = engine.world;
    var options = {
        isStatic: true
    }
    top = Bodies.rectangle(w/2, 100, w, 100, options);
    World.add(world, top)
    ground = Bodies.rectangle(w/2, h, w, 100, options);
    World.add(world, ground);
    left = Bodies.rectangle(0, 0, 100, h*2, options);
    World.add(world, left);
    right = Bodies.rectangle(w, 0, 100, h*2, options);
    World.add(world, right);
    
    for (let index = 0; index < 50; index++) {
        balls.push(new Ball(random(0,w), random(25,50), random(minParticleSize, maxParticleSize)));
    }

    var mouse = Mouse.create(canvas.elt) 
    mouse.pixelRatio = pixelDensity();
    var options = {
        mouse:mouse
    }
    mMouseConstraint = MouseConstraint.create(engine, options)
    World.add(world, mMouseConstraint);

    Events.on(mMouseConstraint, 'mousedown', function(event) {
      for(ball of balls){
        if(dist(ball.x,ball.y,event.mouse.absolute.x,event.mouse.absolute.y) > ball.r){
          for (let i = 0; i < 5; i++) {
            balls.push(new Ball(mouseX, mouseY, random(minParticleSize, maxParticleSize)))
          }
          return
        }
      }
  });
}

function draw() {
  Engine.update(engine);
  background(255)  
  //for (let i = 0; i < cols; i++) {
  //  for (let j = 0; j < rows; j++) {
  //    noFill()
  //    stroke(0)
  //    rect(i*res, j*res, res, res);
  //  }
  //}
  for (var i = 0; i < balls.length; i++) {
      balls[i].show();
  }
  fill(40);
  
  for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
          let y = j * res;
          let x = i * res;

          let topLeft = getMetaballDistance(x, y)
          let topRight = getMetaballDistance(x + res, y) 
          let bottomLeft = getMetaballDistance(x + res, y + res) 
          let bottomRight = getMetaballDistance(x, y + res)

          let state = convertToDec(topLeft,topRight,bottomLeft,bottomRight)

          let amt = (threshold - topLeft) / (topRight - topLeft);
          let a = createVector(lerp(x, x + res, amt), y);

          amt = (threshold - topRight) / (bottomLeft - topRight);
          amt = amt > threshold || amt < -threshold ? 0.5 : amt
          let b = createVector(x + res, y + res * 0.5);  
          
          amt = (threshold - bottomRight) / (bottomLeft - bottomRight);
          let c = createVector(lerp(x, x + res, amt), y + res);

          amt = (threshold - topLeft) / (bottomLeft - topLeft);
          amt = amt > threshold || amt < -threshold ? 0.5 : amt
          let d = createVector(x, y + res * 0.5);
                    
          stroke(0);
          //strokeWeight(1);
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
  }
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
      sum += ball.r * ball.r / ((ball.x-x) * (ball.x-x) + (ball.y-y) * (ball.y-y));
    }
    return sum
}