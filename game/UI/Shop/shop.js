window.Shop = class {
    constructor(config) {
        this.type = config.type; // player, shop, chest
        this.size = config.size; // number of slots divizible by 4
        this.inventory = clone(config.inventory) || Array(20).fill(0);
        this.shopName = config.shopName || "random"
    }

    clone() {
        return new Shop(this);
    }

    toJSON() {
        let ownData = {};
        Object.keys(this).forEach(function (pn) {
            ownData[pn] = this[pn];
        }, this);
        return JSON.reviveWrapper("new Shop($ReviveData$)", ownData);
    }


    create() {

        document.getElementById('shopWindow').innerHTML = "";
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

            document.getElementById('shopWindow').append(cell); // append divs
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

    buy(thisItem) {
        State.variables.inventory.addItem(thisItem.name);
        this.removeItem(thisItem);
        State.variables.player.gold -= thisItem.cost;
        State.variables.player.updateGold();
        let shopItemIndex = State.variables.shopList.find(shop => shop.name === this.shopName).items.findIndex(item => item === thisItem.name)
        State.variables.shopList.find(shop => shop.name === this.shopName).items.splice(shopItemIndex, 1)
    }

    sell(thisItem) {
        State.variables.inventory.removeItem(thisItem.name);
        this.addItem(thisItem);
        State.variables.player.gold += thisItem.cost;
        State.variables.player.updateGold();
        State.variables.shopList.find(shop => shop.name === this.shopName).items.push(thisItem.name)
    }


    viewItem(cell) {
        State.variables.thisItem = this.inventory[cell.dataset.index];
        State.variables.itemLocation = "shop";
        Dialog.setup();
        Dialog.wiki('<<include "itemDescription">>');
        Dialog.open();
    }

    switchShop() {
        document.querySelector('.shopWrap').classList.toggle('shopSwitch')
    }

    test() {
        console.log('test works');
    }

    openShop(shopName, itemCount) {

        State.variables.inventory.location = 'sell';
        State.variables.inventory.create();
        this.inventory = Array(20).fill(0);
        this.shopName = shopName;
        let shop = State.variables.shopList.find(shop => shop.name === shopName);

        if (shopName === "random") {
            let randomAmmount = Math.floor(Math.random() * itemCount + 5) // range (max number - min number) - min number
            for (let i = 0; i < randomAmmount; i++) {
                let randomItem = State.variables.gameItems[Math.floor(Math.random() * State.variables.gameItems.length)]
                this.addItem(randomItem);
                shop.items.push(randomItem.name)
            }
        } else {
            shop.items.forEach(item => {
                this.addItem(item)
            })
        }
        setup.UI.gameUiToggle()
        document.getElementById('shop').classList.toggle('horizontalSlideHidden')
    }

};

document.querySelector('.closeShop').addEventListener('click', () => {
    document.getElementById('shop').classList.toggle('horizontalSlideHidden');
    setup.UI.gameUiToggle()
})

document.querySelector('.switchShop').addEventListener('click', () => {
    State.variables.shop.switchShop()
})


/*---*/
