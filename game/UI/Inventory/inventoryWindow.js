

window.Inventory = class {
    constructor(config) {
        this.type = config.type; // player, shop, chest
        this.location = clone(config.location) ;
        this.size = config.size; // number of slots divizible by 4
        this.inventory = clone(config.inventory) || Array(20).fill(0);
    }

    clone() {
        return new Inventory(this);
    }

    toJSON() {
        let ownData = {};
        Object.keys(this).forEach(function (pn) {
            ownData[pn] = this[pn];
        }, this);
        return JSON.reviveWrapper("new Inventory($ReviveData$)", ownData);
    }


    create() {
        let inventoryWindows = Array.from(document.getElementsByClassName('inventoryWindow'));
        inventoryWindows.forEach(window => { window.innerHTML = "" })
        this.inventory.sort((a, b) => {
            let aIsObj = typeof a === "object";
            let bIsObj = typeof b === "object";
            if (aIsObj && bIsObj) return 0; // both objects
            else if (!aIsObj && !bIsObj) return 0; // both numbers
            else if (aIsObj && !bIsObj) return -1; // a is 'less than' b so it should be sorted earlier
            else if (!aIsObj && bIsObj) return 1; // a is 'greater than' b so it should be sorted later
        });

        this.inventory.forEach((item, index) => {
            inventoryWindows.forEach(window => {

                let cell = document.createElement('div'); // create cell
                cell.dataset.index = index;
                cell.classList.add('inventoryCell');

                let cellStack = document.createElement('div'); // create cell stack
                cellStack.dataset.stackIndex = index;
                cellStack.classList.add('cellStack');
                cellStack.classList.add('displayNone');

                window.append(cell); // append divs
 
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

    viewItem(cell) {
        State.variables.thisItem = clone(State.variables.gameItems.find(item => item.name === this.inventory[cell.dataset.index].name));
        State.variables.itemLocation = this.location;
        Dialog.setup();
        Dialog.wiki('<<include "itemDescription">>');
        Dialog.open();
    }
};
