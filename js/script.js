'use strict';

function titleClickHandler(event){
    const clickedElement = this;
    console.log('Link was clicked!');

    /* [DONE] remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');

    for(let activeLink of activeLinks){
        activeLink.classList.remove('active');
    }
    
    /* [DONE] add class 'active' to the clicked link */
    clickedElement.classList.add('active');
    
    /* [DONE] remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts article.active');

    for(let activeArticle of activeArticles){
        activeArticle.classList.remove('active');
    }

    /* [DONE] get 'href' attribute from the clicked link */
    const atribut = clickedElement.getAttribute("href");
    console.log('atribut = ', atribut);

    /* [DONE] find the correct article using the selector (value of 'href' attribute) */
    const correctArticle = document.querySelector(atribut);

    /* [DONE] add class 'active' to the correct article */
    correctArticle.classList.add('active');
    
}
  
    const links = document.querySelectorAll('.titles a');
  
    for(let link of links){
        link.addEventListener('click', titleClickHandler);
    }
