function Ball(x, y, r) {
    var options = {
      friction: 0,
      restitution: 0.80
    }
    this.body = Bodies.circle(x, y, r, options);
    this.r = r*2;
    this.x = x;
    this.y = y;
    World.add(world, this.body);
  
    this.show = function() {
      var pos = this.body.position;
      this.x = pos.x
      this.y = pos.y
      stroke(0);
      noFill()
      //circle(pos.x, pos.y, this.r)
    }
  }
  