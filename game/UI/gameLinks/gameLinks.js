


window.addButtonsEvents = function () {
    

    const passages = document.querySelectorAll('.passageButton')
   
    console.log(passages);

    Array.from(passages).forEach((button, e) => {
        console.log(e);
    })
}