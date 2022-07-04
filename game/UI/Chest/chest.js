window.Chest = class {
    constructor(config) {
        this.type = config.type; // player, chest, chest
        this.size = config.size; // number of slots divizible by 4
        this.inventory = clone(config.inventory) || Array(20).fill(0);
        this.chestName = config.chestName || "random"
    }

    clone() {
        return new Chest(this);
    }

    toJSON() {
        let ownData = {};
        Object.keys(this).forEach(function (pn) {
            ownData[pn] = this[pn];
        }, this);
        return JSON.reviveWrapper("new Chest($ReviveData$)", ownData);
    }


    create() {

        document.getElementById('chestWindow').innerHTML = "";
        this.inventory.sort((a, b) => {
            let aIsObj = typeof a === "object";
            let bIsObj = typeof b === "object";
            if (aIsObj && bIsObj) return 0; // both objects
            else if (!aIsObj && !bIsObj) return 0; // both numbers
            else if (aIsObj && !bIsObj) return -1; // a is 'less than' b so it should be sorted earlier
            else if (!aIsObj && bIsObj) return 1; // a is 'greater than' b so it should be sorted later
        });

        this.inventory.forEach((item, index) => {
            let cell = document.createElement('div'); // create cell
            cell.dataset.index = index;
            cell.classList.add('inventoryCell');

            let cellStack = document.createElement('div'); // create cell stack
            cellStack.dataset.stackIndex = index;
            cellStack.classList.add('cellStack');
            cellStack.classList.add('displayNone');

            document.getElementById('chestWindow').append(cell); // append divs
            cell.append(cellStack);

            if (item !== 0) {   // append images
                let img = document.createElement('img');
                img.setAttribute('src', item.img);
                cell.style.cursor = "pointer";
                cell.append(img);
                if (item.stack > 1) { // check for stacks
                    cellStack.classList.remove('displayNone');
                    cellStack.innerText = item.stack
                };
                cell.addEventListener('click', (e) => { this.viewItem(cell) })
            }
        })
    }

    addItem(newItem) {
        let fei = this.inventory.findIndex(invCell => invCell === 0); //first empty index
        let thisItem;

        //set thisItem
        if (typeof newItem == 'object') {
            thisItem = newItem;
        }
        else if (typeof newItem == 'string') {
            thisItem = State.variables.gameItems.find(element => element.name === newItem);
        }

        let fitem = this.inventory.find(item => item.name === thisItem.name);
        if (fitem !== undefined) {
            // fitem is an object, and so it is shared with the item in the inventory, so modifying this modifies the one in the inventory
            fitem.stack++;
        } else {
            // It didn't exist
            this.inventory[fei] = clone(thisItem);
        }
        this.create()
    }

    removeItem(newItem) {

        let thisItem;

        //set thisItem
        if (typeof newItem == 'object') {
            thisItem = newItem;
        }
        else if (typeof newItem == 'string') {
            thisItem = State.variables.gameItems.find(element => element.name === newItem);
        };

        let fsi = this.inventory.findIndex(item => item !== 0 && item.name === thisItem.name); //first same item
        if (fsi > -1) { // if there is at least one same item
            this.inventory[fsi].stack--;
            if (this.inventory[fsi].stack === 1) {
                document.querySelector(`[data-stack-index="${fsi}"]`).classList.add('displayNone')
            }
            else if (this.inventory[fsi].stack < 1) {
                this.inventory[fsi] = 0
            }
            this.create()
        }
    }

    take(thisItem) {
        State.variables.inventory.addItem(thisItem.name);
        this.removeItem(thisItem);
        let chestItemIndex = State.variables.chestList.find(chest => chest.name === this.chestName).items.findIndex(item => item === thisItem.name)
        State.variables.chestList.find(chest => chest.name === this.chestName).items.splice(chestItemIndex, 1)
    }

    place(thisItem) {
        State.variables.inventory.removeItem(thisItem.name);
        this.addItem(thisItem);
        State.variables.chestList.find(chest => chest.name === this.chestName).items.push(thisItem.name)
    }

    takeAll() {
        this.inventory.forEach((item, index) => {
            let thisItem = item;
            let fei = State.variables.inventory.inventory.findIndex(index => index === 0);
            if (item !== 0 && fei > -1) {
                let fitem = State.variables.inventory.inventory.find(item => item.name === thisItem.name);
                if (fitem !== undefined) {
                    // fitem is an object, and so it is shared with the item in the inventory, so modifying this modifies the one in the inventory
                    fitem.stack += thisItem.stack;
                    this.inventory[index] = 0;
                } else {
                    // It didn't exist
                    State.variables.inventory.inventory[fei] = thisItem;
                    this.inventory[index] = 0;
                }
            };
        })
        State.variables.inventory.create();
        this.create();
    }

    placeAll() {
        State.variables.inventory.inventory.forEach((item, index) => {
            let thisItem = item;
            let fei = this.inventory.findIndex(index => index === 0);
            if (item !== 0 && fei > -1) {
                let fitem = this.inventory.find(item => item.name === thisItem.name);
                if (fitem !== undefined) {
                    // fitem is an object, and so it is shared with the item in the inventory, so modifying this modifies the one in the inventory
                    fitem.stack += thisItem.stack;
                    State.variables.inventory.inventory[index] = 0;
                } else {
                    // It didn't exist
                    this.inventory[fei] = thisItem;
                    State.variables.inventory.inventory[index] = 0;
                }
            };
        })
        State.variables.inventory.create();
        this.create();
    }

    openChest(chestName, itemCount) {
        State.variables.inventory.location = 'place';
        State.variables.inventory.create();
        this.inventory = Array(20).fill(0);
        this.chestName = chestName;
        let chest = State.variables.chestList.find(chest => chest.name === chestName);

        if (chest !== undefined) {



            if (chestName === "random") {
                let randomAmmount = Math.floor(Math.random() * itemCount + 5) // range (max number - min number) - min number
                for (let i = 0; i < randomAmmount; i++) {
                    let randomItem = State.variables.gameItems[Math.floor(Math.random() * State.variables.gameItems.length)]
                    this.addItem(randomItem);
                    chest.items.push(randomItem.name)
                }
            } else {
                chest.items.forEach(item => {
                    this.addItem(item)
                })
            }
            setup.UI.gameUiToggle()
            document.getElementById('chest').classList.toggle('horizontalSlideHidden')
        } else {
            alert("chestNotCreated")
        }


    }

    switchChest() {
        document.querySelector('.chestWrap').classList.toggle('chestSwitch')
    }

    viewItem(cell) {
        State.variables.thisItem = this.inventory[cell.dataset.index];
        State.variables.itemLocation = "take";
        Dialog.setup();
        Dialog.wiki('<<include "itemDescription">>');
        Dialog.open();
    }
}

document.querySelector('.closeChest').addEventListener('click', () => {
    document.getElementById('chest').classList.toggle('horizontalSlideHidden');
    setup.UI.gameUiToggle()
})

document.querySelector('.switchChest').addEventListener('click', () => {
    State.variables.chest.switchChest()
})
document.querySelector('.takeAll').addEventListener('click', () => {
    State.variables.chest.takeAll()
})
document.querySelector('.placeAll').addEventListener('click', () => {
    State.variables.chest.placeAll()
})