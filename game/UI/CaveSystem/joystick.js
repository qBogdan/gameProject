

window.joystick = {
  X: 0,
  Y: 0,
  angle: 0,
  held: false,
  base: "",
  stick: "",

  create(containerClass) {
    this.base = document.createElement('div');
    this.base.classList.add('joystickBase')

    this.stick = document.createElement('div');
    this.stick.classList.add('stick')

    this.base.append(this.stick);

    const container = document.getElementById(containerClass);
    container.append(this.base);

    this.getCenter();

    [
      "mousedown", "touchstart"
    ].forEach(type => this.base.addEventListener(type, ev => {
      this.held = true;
      this.moveInterval = setInterval(() => this.checkDirection(), 300);
      document.body.style.pointerEvents = "none";
      document.body.style.cursor = "none";
      this.setStickPositionViaInput(ev.type === "touchstart" ? ev.touches[0] : ev);
      
    }));

    [
      "mousemove", "touchmove"
    ].forEach(type => document.addEventListener(type, ev => {
      if (this.held) this.setStickPositionViaInput(ev.type === "touchmove" ? ev.touches[0] : ev);
    }));

    [
      "mouseup", "mouseleave", "touchend"
    ].forEach(type => document.addEventListener(type, ev => {
      this.held = false;
      clearInterval(this.moveInterval);
      document.body.style.pointerEvents = "auto";
      document.body.style.cursor = "auto";
      this.setStickPosition(0, 0);
    }));
  },

  getCenter() {
    const { x, y, width, height } = this.base.getBoundingClientRect();
    return {
      x: x + width / 2,
      y: y + height / 2
    };
  },

  getNormalisedPosition(dX, dY, limiter = 0.8 /* default limter strength. 0 for free, higher values for tighter */) {
    const radius = this.base.getBoundingClientRect().width / 2 / (1 + limiter);
    const direction = Math.atan2(dY, dX);
    const magnitude = Math.min(radius, Math.sqrt(dY ** 2 + dX ** 2));
    const pos = {
      dX: magnitude * Math.cos(direction),
      dY: magnitude * Math.sin(direction)
    };
    return pos;
  },

  setStickPosition(_dX, _dY) {
    const { dX, dY } = this.getNormalisedPosition(_dX, _dY);
    this.stick.style.left = dX + "px";
    this.stick.style.top = dY + "px";

    this.X = dX;
    this.Y = dY;
    this.angle = (Math.atan2(this.X, this.Y) * 180 / Math.PI) + 180;

  },

  checkDirection() {
    const cave = variables().cave;
    if (this.Y > 15 && this.angle > 135 && this.angle < 225) cave.down();
    else if (this.Y < -15 && ((this.angle >= 0 && this.angle <= 45) || (360 >= this.angle && 315 <= this.angle))) cave.up();
    else if (this.X < -15 && this.angle > 45 && this.angle < 135) cave.left();
    else if (this.X > 15 && this.angle > 225 && this.angle < 315) cave.right();
  }
  ,

  setStickPositionViaInput({ clientX, clientY }) {
    const { x, y } = this.getCenter();
    const dX = clientX - x;
    const dY = clientY - y;
    this.setStickPosition(dX, dY);
  },




}