window.Cave = class Cave {
    constructor(config) {
        this.start = config.start,
            this.active = config.active,
            this.map = clone(config.map) || [],
            this.cave = clone(config.cave);
        this.coords = clone(config.coords) || {
            north: 0,
            east: 0,
            south: 0,
            west: 0,
        }
    }

    clone() {
        return new Cave(this);
    }

    toJSON() {
        let ownData = {};
        Object.keys(this).forEach(function (pn) {
            ownData[pn] = this[pn];
        }, this);
        return JSON.reviveWrapper("new Cave($ReviveData$)", ownData);
    }

    create(thisCave) {
        this.cave = thisCave;
        if (this.cave.map.length > 400) {
            this.map = this.cave.map.split(/\s+|\r?\n/);
        } else {
            this.map = this.cave.map.split('');
        }
        
        this.start = this.cave.start;
        this.active = this.start;

        const caveContainer = document.querySelector(`.${this.cave.name}`);
        caveContainer.classList.add('caveContainer');

        const cavePicture = document.createElement('img');
        cavePicture.classList.add('cavePicture');
        cavePicture.style.height = (this.cave.height / 5) * 100 + '%';
        cavePicture.style.width = (this.cave.width / 5) * 100 + '%';
        cavePicture.style.backgroundImage = 'url(' + this.cave.image; + ')'

        const playerTile = document.createElement('div');
        playerTile.classList.add('playerTile');

        caveContainer.append(cavePicture);
        caveContainer.append(playerTile);

        this.updateMap()
    };

    getCell(cellIndex) {
        return document.querySelectorAll('.caveTile')[cellIndex]
    }

    updateMap() {
        this.neighbor()
        let x = Math.floor(this.active / this.cave.height);
        let y = this.active % this.cave.width;

        $('.cavePicture').css('top', '-' + ((20 * x) - 40) + '%');
        $('.cavePicture').css('left', '-' + ((20 * y) - 40) + '%');

        console.log(this.map[this.active]);
        this.checkEvent()
    }

    neighbor() {
        this.coords.north = this.active - 20;
        this.coords.east = this.active + 1;
        this.coords.south = this.active + 20;
        this.coords.west = this.active - 1;
    }

    checkEvent() {
        if (this.map[this.active] === "E") {
            joystick.held = false;
            Dialog.setup();
            Dialog.wiki(`<<include "${this.cave.name}Event_${this.active}">>`);
            Dialog.open()
        } else if (this.map[this.active] === "C") {
            joystick.held = false;
            let chest = this.cave.name + '_' + this.active;
            State.variables.chest.openChest(chest)
        }

    }

    changeMap(index, value){
        this.map[index] = value;
        State.variables[this.cave.name].map = this.map.join('');
        this.map = State.variables[this.cave.name].map.split('');
        this.updateMap();
    }

    up() {
        if (this.map[this.coords.north] !== ".") {
            this.active = this.coords.north;
            this.updateMap()
        }
    }

    right() {
        if (this.map[this.coords.east] !== ".") {
            this.active = this.coords.east;
            this.updateMap()
        }
    }

    left() {
        if (this.map[this.coords.west] !== ".") {
            this.active = this.coords.west;
            this.updateMap()
        }
    }

    down() {
        if (this.map[this.coords.south] !== ".") {
            this.active = this.coords.south;
            this.updateMap()
        }
    }
}
