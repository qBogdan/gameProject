

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

Macro.add('dialoguebutton', {
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
            e.target.classList.add('visitedDialogue')
            //Engine.play(passage)
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
        button.classList.add('passageButton');
        button.innerText = this.payload[0].contents;
        let passage = this.args[0];

        button.addEventListener('click', e => {
            e.target.remove()
        })
        
        $(this.output).append(button);
    }
})