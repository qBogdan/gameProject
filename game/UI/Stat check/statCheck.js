window.checkStat = {
    base: $('.checkContainer')[0],
    arrow: $('.arrow')[0],
    choice1: $('.choice1')[0],
    choice2: $('.choice2')[0],
    choice3: $('.choice3')[0],
    X: 0,
    Y: 0,
    held: false,
    angle: 0,
    active: $('.choice1')[0],
    selected: 0,

    addEvents() {

        [
            "mousedown", "touchstart"
        ].forEach(type => this.arrow.addEventListener(type, ev => {
            this.held = true;
            this.arrow.style.pointerEvents = 'none';
            this.arrow.style.cursor = 'none';
            this.arrow.style.transition = 'none';
            this.setStickPositionViaInput(ev.type === "touchstart" ? ev.touches[0] : ev);
            
        }));

        [
            "mousemove", "touchmove"
        ].forEach(type => document.addEventListener(type, ev => {
            if (this.held) this.setStickPositionViaInput(ev.type === "touchmove" ? ev.touches[0] : ev);
            this.checkSelection();
        }));

        [
            "mouseup", "mouseleave", "touchend"
        ].forEach(type => document.addEventListener(type, ev => {
            if (this.held === true) this.applySelected() ;
            this.held = false;
            this.arrow.style.pointerEvents = 'auto';
            this.arrow.style.cursor = 'auto';
            this.arrow.style.transition = '.3s ease-out';
            this.arrow.style.transform = 'rotate(-315deg)';
            
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

    setStickPositionViaInput({ clientX, clientY }) {
        const { x, y } = this.getCenter();
        const dX = clientX - x;
        const dY = clientY - y;
        this.setStickPosition(dX, dY);
    },

    setStickPosition(_dX, _dY) {
        const { dX, dY } = this.getNormalisedPosition(_dX, _dY);
        this.X = dX;
        this.Y = dY;
        this.angle = (Math.atan2(this.X, this.Y) * 180 / Math.PI) + 180;
        this.arrow.style.transform = 'rotate(-' + (this.angle + 135) + 'deg)'
    },

    checkSelection() {
        this.active.classList.remove('choiceFocus')
        if (this.held === false) {
            return
        } else {
            if (this.angle > 120 && this.angle < 160) {
                this.active = this.choice1;
                this.selected = 1;
            }
            if (this.angle > 160 && this.angle < 200) {
                this.active = this.choice2;
                this.selected = 2;
            }
            if (this.angle > 200 && this.angle < 240) {
                this.active = this.choice3;
                this.selected = 3;

            } else if(this.angle < 120 || this.angle > 240) {
                this.active = this.arrow
                this.selected = 'none';
            }
        this.active.classList.add('choiceFocus')    ;
        }
    },

    applySelected() {
        console.log(this.selected);
    }
}
