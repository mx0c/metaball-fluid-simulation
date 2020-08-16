function Box(x, y, w, h, angle = 0) {
    this.body = Bodies.rectangle(x, y, w, h, { isStatic: true, angle: angle }); 
    this.w = w;
    this.h = h;
    World.add(world, this.body);
  
    this.show = function() {
        var pos = this.body.position;
        var angle = this.body.angle;
        push();
        translate(pos.x, pos.y)
        rotate(angle)
        rectMode(CENTER)
        fill(66)
        rect(0, 0, this.w, this.h)
        var pos = this.body.position;
        circle(pos.x, pos.y, this.r)
        pop();
    }
  }
  