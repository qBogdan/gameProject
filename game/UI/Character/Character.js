
window.Character = class Character {
    constructor(config) {
        this.name = config.name;
        this.maxHealth = config.maxHealth;
        this.maxStamina = config.maxStamina,
            this.health = config.health || this.maxHealth,
            this.stamina = config.stamina || this.maxStamina,
            this.gold = config.gold || 200,
            this.pet = config.pet || "none",

            this.attributes = clone(config.attributes) || {
                Strength: 0,
                Agility: 0,
                Dexterity: 0,
                Intelligence: 0,
                Charisma: 0,
                Stealth: 0,
            },

            this.bonusAttributes = clone(config.bonusAttributes) || {
                Strength: 0,
                Agility: 0,
                Dexterity: 0,
                Intelligence: 0,
                Charisma: 0,
                Stealth: 0,
            }

        this.equipment = clone(config.equipment) ||
            [0, 0, 0, 0, 0] // head , body , feet , accesory , tool
    }


    clone() {
        return new Character(this);
    }

    toJSON() {
        let ownData = {};
        Object.keys(this).forEach(function (pn) {
            ownData[pn] = this[pn];
        }, this);
        return JSON.reviveWrapper("new Character($ReviveData$)", ownData);
    }


    // === Methods === //

    changeHealth(value) {
        let newVal = this.health += value;
        let newPercentage;
        if (newVal >= this.maxHealth) {
            this.health = this.maxHealth;
        } else if (newVal > 0 && newVal < this.maxHealth) {
            this.health = newVal;
        } else if (newVal <= 0) {
            this.health = 0;
        }
        this.updateHealth(newPercentage)
    }

    changeStamina(value) {
        let newVal = this.stamina += value;
        let newPercentage;
        if (newVal >= this.maxStamina) {
            this.stamina = this.maxStamina;
        } else if (newVal > 0 && newVal < this.maxStamina) {
            this.stamina = newVal;
        } else if (newVal <= 0) {
            this.stamina = 0;

        }
        this.updateStamina(newPercentage)
    }

    updateHealth() {
        let newPercentage = ((this.health / this.maxHealth) * 100)
        let healthBars = document.querySelectorAll('.healthProgress');
        let healthValue = document.querySelectorAll('.healthValue');

        Array.from(healthBars).forEach(bar => {
            bar.style.width = newPercentage + '%';
        })
        Array.from(healthValue).forEach(value => {
            value.innerText = this.health
        })
    }

    updateStamina() {
        let newPercentage = ((this.stamina / this.maxStamina) * 100)
        let staminaBars = document.querySelectorAll('.staminaProgress');
        let staminaValue = document.querySelectorAll('.staminaValue');

        Array.from(staminaBars).forEach(bar => {
            bar.style.width = newPercentage + '%';
        })
        Array.from(staminaValue).forEach(value => {
            value.innerText = this.stamina
        })
    }

    updateGold() {
        let gold =  Array.from(document.getElementsByClassName('gold'));
        gold.forEach(purse => purse.innerText = this.gold)
    }

    eat(thisItem) {
        let h, s;
        if (thisItem.tags.find(tag => tag === 'heal')) { if (this.health < this.maxHealth) { h = true }; this.changeHealth(thisItem.attributes.heal) };
        if (thisItem.tags.find(tag => tag === 'stamina')) { if (this.stamina < this.maxStamina) { s = true }; this.changeStamina(thisItem.attributes.rest) };

        if (h === true || s === true) {
            State.variables.inventory.removeItem(thisItem);
        }
    }


    updateEquipment() {
        document.querySelector('.characterEquipment').innerHTML = "";
        this.equipment.forEach((part, index) => {
            let slot = document.createElement('div');
            slot.classList.add('equipSlot');
            slot.dataset.equipIndex = index;
            if (part !== 0) {
                let img = document.createElement('img');
                img.setAttribute('src', part.img);
                slot.append(img);
                slot.addEventListener('click', () => {
                    State.variables.thisItem = part;
                    State.variables.itemLocation = "character";
                    Dialog.setup();
                    Dialog.wiki('<<include "itemDescription">>');
                    Dialog.open();
                })
            }
            document.querySelector('.characterEquipment').append(slot);
        })
        
        this.calculateStats()
    }

    equip(thisItem){
        if (this.equipment[thisItem.tags[0]] !== 0) {
            State.variables.inventory.addItem(this.equipment[thisItem.tags[0]])
        }
        State.variables.inventory.removeItem(thisItem) 
        this.equipment[thisItem.tags[0]] = thisItem ;
        this.updateEquipment()
    }

    unequip(thisItem) {
        State.variables.inventory.addItem(this.equipment[thisItem.tags[0]]);
        this.equipment[thisItem.tags[0]] = 0;
        this.updateEquipment();
    }

    calculateStats() {
        let attributesStat = Array.from(document.querySelectorAll('.attribute'));
        let bonus = Array.from(document.querySelectorAll('.bonus'));
        let index = 0 ;
        let bIndex = 0 ;

        for( let atr in this.attributes ) {
            attributesStat[index].innerText = this.attributes[atr];
            index++
        }

        for( let a in this.bonusAttributes){
            this.bonusAttributes[a] = 0;
        }

        this.equipment.forEach(item => {
            let {attributes} = item;
            for (let a in attributes) {
                this.bonusAttributes[a] += attributes[a]
            }
        })

        for( let b in this.bonusAttributes) {
            bonus[bIndex].innerText = '+ ' + this.bonusAttributes[b];
            bIndex++

        }
    }

};

window.updateGame = function() {
    State.variables.inventory.create();
    State.variables.map.create();
    State.variables.player.updateHealth();
    State.variables.player.updateStamina();
    State.variables.player.updateEquipment();
    State.variables.player.updateGold();
    State.variables.diary.updateDiary();
}
