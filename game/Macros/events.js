$(document).on(':passagestart', ()=> {
    if (visited() < 2) {
        State.variables[`${passage()}_btnHistory`] = {};
    }
    State.variables.btnCount = 1;
});

