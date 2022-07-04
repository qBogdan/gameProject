
setup.UI =  {
    upperUi : document.querySelector('.upperUi'),
    textUi : document.querySelector('.textUi'),
    lowerUi : document.querySelector('.lowerUi'),

    navigationMenu : document.querySelector('.navigationMenu'),
    navigationMenuButton : document.getElementsByClassName('navigationMenuButton'),

    blurWindow : document.querySelector('.blurWindow'),

    inventory : document.getElementById('inventory'),
    character : document.getElementById('character'),
    diary : document.getElementById('diary'),
    map : document.getElementById('map'),
    shop : document.getElementById('shop'),
    chest : document.getElementById('chest'),
    activeWindow: document.getElementById('inventory'),

    addEvents() {
        const selectionButtons = Array.from(document.getElementsByClassName('navigationMenuButton'));
        selectionButtons.forEach( part => {
        part.addEventListener('click', e =>{
            if (e.target.dataset.window !== "close"){
                this.activeWindow.classList.toggle('verticalSlideHidden');
                this.activeWindow = document.getElementById(e.target.dataset.window);
                setTimeout(() => {
                    this.activeWindow.classList.toggle('verticalSlideHidden');
                }, 400);
            } else if (e.target.dataset.window === 'close') {
                this.activeWindow.classList.toggle('verticalSlideHidden');
                setTimeout(() => {
                    this.close()
                }, 300);
            }            
        } )
    });
    },

    gameUiToggle() {
        this.upperUi.classList.toggle('upperUiHidden');
        this.lowerUi.classList.toggle('lowerUiHidden');
        this.blurWindow.classList.toggle('displayNone');
    },

    open() {
        State.variables.inventory.location = "inventory";
        State.variables.inventory.create();
        State.variables.player.updateEquipment()
        this.gameUiToggle();
        setTimeout(() => {
            this.navigationMenu.classList.remove('navigationMenuHidden');
            this.activeWindow.classList.toggle('verticalSlideHidden');            
        }, 300);
    },

    close() {
        this.navigationMenu.classList.add('navigationMenuHidden');
        setTimeout(() => {
            this.gameUiToggle()
        }, 300);

    }
};


document.getElementsByClassName('navigationButton')[0].addEventListener('click', () => {setup.UI.open()})

