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

const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles';



function generateTitleLinks(customSelector = ''){
    /* remove contents of titleList */
    const titleList = document.querySelector(optTitleListSelector);
    titleList.innerHTML = '';
    
    /* for each article */
    const articles = document.querySelectorAll(optArticleSelector + customSelector);
    let html = '';
    for(let article of articles){
        /* get the article id */
        const articleId = article.getAttribute("id");

        /* find the title element */
        const articleTitle = article.querySelector(optTitleSelector).innerHTML;

        /* get the title from the title element */

        /* create HTML of the link */
        const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
        console.log('link html = ', linkHTML);

        /* insert link into titleList */
        html = html + linkHTML;
    }
    titleList.innerHTML = html;
    const links = document.querySelectorAll('.titles a');
    for(let link of links){
        link.addEventListener('click', titleClickHandler);
    }
}

generateTitleLinks();

const optArticleTagsSelector = '.post-tags .list';

function generateTags(){
    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);

    /* START LOOP: for every article: */
    for(let article of articles){
        /* find tags wrapper */
        const wrapperFinder = article.querySelector(optArticleTagsSelector);

        /* make html variable with empty string */            
        let html = '';
    
        /* get tags from data-tags attribute */
        const articleTags = article.getAttribute("data-tags");
        const articleNumber = article.getAttribute("id");
        console.log(articleNumber, ' tag = ', articleTags);
        
        /* split tags into array */
        const articleTagsArray = articleTags.split(' ');
        console.log('tablica ', articleTagsArray);
        
        /* START LOOP: for each tag */
        for(let tag of articleTagsArray){
            /* generate HTML of the link */
            const tagHTML = '<li><a href="#tag-' + tag + '">' + tag +'</a></li>';
            console.log('tag html = ', tagHTML);
            
            /* add generated code to html variable */
            html = html + tagHTML;
            /* END LOOP: for each tag */
        }    
    /* insert HTML of all the links into the tags wrapper */
    wrapperFinder.innerHTML = html;
    /* END LOOP: for every article: */
    }
}

generateTags();

function tagClickHandler(event){
    /* prevent default action for this event */

    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;

    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute("href");

    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');

    /* find all tag links with class active */
    const tagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

    /* START LOOP: for each active tag link */
    for(let tagLink of tagLinks){
        /* remove class active */
        tagLink.classList.remove('active');
    /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const hrefTags = document.querySelectorAll(href);

    /* START LOOP: for each found tag link */
    for(let hrefTag of hrefTags){
        /* add class active */
        hrefTag.classList.add('active');
        /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
}

//                                        STH WRONG :
const horizontalList = document.querySelectorAll('.list-horizontal');

function addClickListenersToTags(){
    /* find all links to tags */
    //const href = horizontalList.getAttribute("href");
    const allTagLinks = clickedElement.querySelectorAll('a[href="' + href + '"]');

    /* START LOOP: for each link */
    for(let allTagLink of allTagLinks){
        /* add tagClickHandler as event listener for that link */
        allTagLink.addEventListener('click', titleClickHandler);
    }
    /* END LOOP: for each link */
}

// ODKOMENTOWAC:
//addClickListenersToTags(); 

function generateAuthors(){
    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);

    /* START LOOP: for every article: */
    
    for(let article of articles){
        /* find tags wrapper */
        const wrapperFinder = article.querySelector('.post-author');

        /* make html variable with empty string */            
        let html = '';
    
        /* get tags from data-tags attribute */
        const articleAuthors = article.getAttribute("data-author");
        const articleNumber = article.getAttribute("id");
        console.log(articleNumber, ' Author = ', articleAuthors);
        
        /* START LOOP: for each tag */
        for(let articleAuthor of articleAuthors){
            /* generate HTML of the link */
            const authorHTML = articleAuthor;
        
            /* add generated code to html variable */
            html = html + authorHTML;
            
            /* END LOOP: for each tag */
        }    
        console.log('KONIEC html = ', html);
        /* insert HTML of all the links into the tags wrapper */
        wrapperFinder.innerHTML = html;
        /* END LOOP: for every article: */
    }
}

generateAuthors();

/* NIEDOKONCZONE : mam zle te same funkcje dotyczace tagow
function addClickListenersToAuthors(){
    //* find all links to tags 
    const href = horizontalList.data("href");
    const allTagLinks = clickedElement.querySelectorAll('a[href="' + href + '"]');

    //* START LOOP: for each link /
    for(let allTagLink of allTagLinks){
        //* add tagClickHandler as event listener for that link /
        allTagLink.addEventListener('click', titleClickHandler);
    }
    //* END LOOP: for each link /
}

function authorClickHandler(event){
    const clickedElement = this;
	console.log('Link was clicked!');

	//* [DONE] remove class 'active' from all article links 
    const activeLinks = document.querySelectorAll('.titles a.active');

    for(let activeLink of activeLinks){
        activeLink.classList.remove('active');
    }
	
    //* [DONE] add class 'active' to the clicked link 
    clickedElement.classList.add('active');
    
    //* [DONE] remove class 'active' from all articles 
    const activeArticles = document.querySelectorAll('.posts article.active');

    for(let activeArticle of activeArticles){
        activeArticle.classList.remove('active');
    }

    //* [DONE] get 'href' attribute from the clicked link 
    const atribut = clickedElement.getAttribute("href");
    console.log('atribut = ', atribut);

    //* [DONE] find the correct article using the selector (value of 'href' attribute) 
    const correctArticle = document.querySelector(atribut);

    //* [DONE] add class 'active' to the correct article 
    correctArticle.classList.add('active');
}
*/