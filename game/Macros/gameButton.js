

Macro.add('gotobutton', {
    isAsync: true,
    tags: null,
    handler: function () {
        if (this.args.length === 0) {
            return this.error('Passage name not provided');
        }

        const button = document.createElement('div');
        button.classList.add('passageButton');
        button.innerText = this.payload[0].contents;
        let passage = this.args[0];

        button.addEventListener('click', e => {
            Engine.play(passage)
        })

        $(this.output).append(button);
    }
})


Macro.add('removebutton', {
    isAsync: true,
    tags: null,
    handler: function () {
        if (this.args.length === 0) {
            return this.error('Passage name not provided');
        }

        const button = document.createElement('div');
        button.classList.add('removeButton');
        button.innerText = this.payload[0].contents;
        button.dataset.btnNum = State.variables.btnCount;
        
        if (visited() < 2) {
            State.variables[`${passage()}_btnHistory`][`btn${State.variables.btnCount}`] = false;
        }

        button.addEventListener('click', e => {
            State.variables[`${passage()}_btnHistory`][`btn${e.target.dataset.btnNum}`] = true;
            Engine.play(this.args[0]);
        })
        
        if (State.variables[`${passage()}_btnHistory`][`btn${State.variables.btnCount}`] === false){
            $(this.output).append(button);
        }

        State.variables.btnCount ++;
    }
})


Macro.add('dialoguebutton', {
    isAsync: true,
    tags: null,
    handler: function () {
        if (this.args.length === 0) {
            return this.error('Passage name not provided');
        }

        const button = document.createElement('div');
        button.classList.add('dialogueButton');
        button.innerText = this.payload[0].contents;
        button.dataset.btnNum = State.variables.btnCount;
        
        if (visited() < 2) {
            State.variables[`${passage()}_btnHistory`][`btn${State.variables.btnCount}`] = false;
        }

        button.addEventListener('click', e => {
            State.variables[`${passage()}_btnHistory`][`btn${e.target.dataset.btnNum}`] = true;
            Engine.play(this.args[0]);
        })
        
        if (State.variables[`${passage()}_btnHistory`][`btn${State.variables.btnCount}`] === true){
            button.classList.add('visitedDialogue')
        }

        $(this.output).append(button);
        State.variables.btnCount ++;
    }
})