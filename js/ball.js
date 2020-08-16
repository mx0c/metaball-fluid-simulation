function Ball(x, y, r) {
    var options = {
      friction: 0,
      restitution: 0.85
    }
    this.body = Bodies.circle(x, y, r, options);
    this.r = 2*r;
    this.x = x;
    this.y = y;
    World.add(world, this.body);
  
    this.update = function(){
      var pos = this.body.position;
      this.x = pos.x
      this.y = pos.y
    }

    this.show = function() {
      fill(155)
      var pos = this.body.position;
      circle(pos.x, pos.y, this.r)
    }
  }
  