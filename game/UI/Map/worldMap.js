window.Map = class Map {
    constructor(config) {
        this.locations = clone(config.locations) || [];
        this.pathWays = clone(config.pathWays) || {
            //      field , town, mansion, camp, mine, cave
            field:   [  0,  -1,     -1,     1,     1,  -1],
            town:    [ -1,   0,      0,     0,     0,   0],
            mansion: [ -1,   0,      0,    -1,    -1,  -1],
            camp:    [  1,   0,     -1,     0,    -1,  -1],
            mine:    [  1,   1,     -1,     1,     0,   0],
            cave:    [ -1,   0,     -1,    -1,     0,   0]
        };
        this.playerLocation = config.playerLocation || "";
        this.selectedLocation = config.selectedLocation || "";
    }

    clone() {
        return new Map(this);
    }

    toJSON() {
        let ownData = {};
        Object.keys(this).forEach(function (pn) {
            ownData[pn] = this[pn];
        }, this);
        return JSON.reviveWrapper("new Map($ReviveData$)", ownData);
    }

    create() {

        Array.from(document.querySelectorAll('.mapLocation')).forEach((loc, index) => {
            let location = {
                active: false,
                discovered: false,
                id: loc.id,
                index: index,
                passage: loc.id + 'Passage'
            }
            this.locations.push(location);
        })
        this.updateMap();
    }

    resetLocations() { // reset locations for the start of the game
        this.locations.forEach(location => {
            document.getElementById(`${location.id}`).classList.add('displayNone');
            location.discovered = false
        });
        this.updateMap()
    }

    addEvents() {
        Array.from(document.querySelectorAll('.mapLocation')).forEach((loc, index) => { 
            loc.addEventListener('click', e => {
                State.variables.map.selectedLocation = e.target.id;
                Dialog.setup();
                Dialog.wiki('<<include "travel">>');
                Dialog.open()
            })
        })
    };

    travel() {
        this.playerLocation = this.selectedLocation;
        this.updateMap();
        Engine.play(this.locations.find(loc => loc.id === this.playerLocation).passage);
        document.getElementById(`${this.playerLocation}`).scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" })
    }

    updateMap() {

        this.locations.forEach(location => { // activates player location
            if (location.id === this.playerLocation) {
                location.active = true
            } else {
                location.active = false
            }
       
            if (location.active === true) {
                document.getElementById(`${location.id}H`).classList.remove('displayNone')
            } else {
                document.getElementById(`${location.id}H`).classList.add('displayNone')
            }
        }); 

        this.pathWays[this.playerLocation].forEach((location, index) => { // displays locations based on distance and they are discovered
            
            if (this.locations[index].discovered === true) {
                document.getElementById(`${this.locations[index].id}`).classList.remove('displayNone')
            };
            
            if (location > -1 && location <2) {
                document.getElementById(`${this.locations[index].id}`).classList.remove('unselectable');
                document.getElementById(`${this.locations[index].id}`).classList.remove('displayNone');
                this.locations[index].discovered = true
            };

            if ( location < 0 && this.locations[index].discovered === true) {
                document.getElementById(`${this.locations[index].id}`).classList.add('unselectable')
            }
        })
    }
}

