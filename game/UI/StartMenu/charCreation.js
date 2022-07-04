
let avaiblePoints = 3;

setup.charCreation = function () {

    document.getElementById('avaiblePoints').innerText = `Avaible points: ${avaiblePoints}`;
    const charButtons = $(".charCreation");

    Array.from(charButtons).forEach(button => {
        button.addEventListener('click', e => {
            setCharacterPoints(e);
        })
    })
};


function setCharacterPoints(e) {

    let attribute = e.target.dataset.charAtr;

    if (e.target.dataset.charFunction === "minus") {
        if (State.variables.player.attributes[attribute] > 0) {
            State.variables.player.attributes[attribute]--;
            avaiblePoints++;
            document.getElementById('avaiblePoints').innerText = `Avaible points: ${avaiblePoints}`;
        }
    } else {
        if (avaiblePoints > 0 && State.variables.player.attributes[attribute] < 5 ) {
            State.variables.player.attributes[attribute]++;
            avaiblePoints--;
            document.getElementById('avaiblePoints').innerText = `Avaible points: ${avaiblePoints}`;
        }
    }

    document.getElementById(`display${attribute}`).innerText = State.variables.player.attributes[attribute]
};


setup.signPaper = function () {
    if (avaiblePoints > 0) {
        console.log('Not all points spent');
    } else {
        if ( document.getElementById('playerNameInput').value.trim().length > 0) {
            State.variables.player.name = document.getElementById('playerNameInput').value
            Engine.play('Sign');            
        } else {
            console.log('Please say name');
        }
    }
};