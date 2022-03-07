'use strict';

function titleClickHandler(event){
    const clickedElement = this;
    console.log('Link was clicked!');

    /* [DONE] remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');

    for(let activeLink of activeLinks){
        activeLink.classList.remove('active');
    }
    
    /* [IN PROGRESS] add class 'active' to the clicked link */
    clickedElement.classList.add('active');
    
    /* [DONE] remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts article.active');

    for(let activeArticle of activeArticles){
        activeArticle.classList.remove('active');
    }

    /* [IN PROGRESS] get 'href' attribute from the clicked link */
    const atribut = clickedElement.getAttribute("href");
    console.log('atribut = ', atribut);

    /* [IN PROGRESS] find the correct article using the selector (value of 'href' attribute) */
    const correctArticle = document.querySelector(atribut);

    /* [IN PROGRESS] add class 'active' to the correct article */
    correctArticle.classList.add('active');
    
}
  
    const links = document.querySelectorAll('.titles a');
  
    for(let link of links){
        link.addEventListener('click', titleClickHandler);
    }





















/*

function titleClickHandler(){
  const links = document.querySelectorAll('.titles a');
  console.log(links);
}

const buttonTest = document.getElementById('button-test');

buttonTest.addEventListener('click', titleClickHandler);

/*


/*

document.querySelectorAll(selector)         // wyszuka wszystkie elementy, pasujące do selektora.

/*

function titleClickHandler()

/*



/*

const buttonRock = document.getElementById('button-rock');
const buttonPaper = document.getElementById('button-paper');
const buttonScissors = document.getElementById('button-scissors');
function buttonClicked(argButtonName){
    clearMessages();
    console.log(argButtonName + ' został kliknięty');
    //const computerMove;
    const randomNumber = Math.floor(Math.random() * 3 + 1);
    console.log('Wylosowana liczba to: ' + randomNumber);
    //playerMove = argButtonName;
    function gameResult(player, comp){
        if (randomNumber == 1){
            comp = 'kamień';
            printMessage('Komputer wybrał kamień');
        } else if (randomNumber == 2) {
            comp = 'papier';
            printMessage('Komputer wybrał papier');
        } else if (randomNumber == 3){
            comp = 'nożyce';
            printMessage('Komputer wybrał nożyce');
        }
        
        if (player == comp){
            printMessage('Remis');
        } else if (player == 'kamień' && comp == 'nożyce'){
            printMessage('Wygrałeś');
        } else if (player == 'papier' && comp == 'kamień'){
            printMessage('Wygrałeś');
        } else if (player == 'nożyce' && comp == 'papier'){
            printMessage('Wygrałeś');
        } else {
            printMessage('Przegrałeś');
        }
    }
    printMessage('Twój ruch: ' + argButtonName);
    gameResult(argButtonName);
}
buttonRock.addEventListener('click', function(){
    buttonClicked('kamień');
});
buttonPaper.addEventListener('click', function(){
    buttonClicked('papier');
});
buttonScissors.addEventListener('click', function(){
    buttonClicked('nożyce');
});

*/
