'use strict';

function titleClickHandler(event){
  const clickedElement = this;
  //console.log('Link was clicked!');

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
  //console.log('atribut = ', atribut);

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
    //console.log('link html = ', linkHTML);

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
const optTagsListSelector = '.tags.list';
const optCloudClassCount = 5;
const optCloudClassPrefix = 'tag-size-';

function calculateTagClass(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
  //const tagLinkHTML = '<li><a class=' + optCloudClassPrefix + classNumber + '></a></li>';
  //return optCloudClassPrefix + classNumber;
  //console.log('kom: ', optCloudClassPrefix, classNumber);
  return optCloudClassPrefix + classNumber;
}

function calculateTagsParams(tags){
  const params = {
    max: 0,
    min: 999999
  }
  for(let tag in tags){
    //console.log(tag + ' is used ' + tags[tag] + ' times');

    if(tags[tag] > params.max){
      params.max = tags[tag];
    }
    if(tags[tag] < params.min){
      params.min = tags[tag];
    }
  }
  return params;
}

function generateTags(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
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
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    /* START LOOP: for each tag */
    for(let tag of articleTagsArray){
      /* generate HTML of the link */
      const tagHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      const space = ' ';
      /* add generated code to html variable */
      html = html + tagHTML + space;
      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags.hasOwnProperty(tag)){
        /* [NEW] add generated code to allTags array */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
      /* END LOOP: for each tag */
    }    
    /*insert HTML of all the links into the tags wrapper */
    wrapperFinder.innerHTML = html;
    /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);
  const tagsParams = calculateTagsParams(allTags);
  //console.log('tagsParams:', tagsParams);
  /* [NEW] create variable for all links HTML code ----------------- */
  let allTagsHTML = ' ';
  /* [NEW] START LOOP: for each tag in allTags */
  for(let tag in allTags){
    const tagLinkHTML = calculateTagClass(allTags[tag], tagsParams);
    //console.log('tagLinkHTML: ', tagLinkHTML, 'tag: ', tag ,'tagsParams: ', tagsParams,'allTags[tag]: ', allTags[tag]);
    const tagLine = '<li><a class="' + optCloudClassPrefix + allTags[tag] + '" href=#tag-' + tag + '>' + tag + ' ' + '</a></li>';
    const space = ' ';
    //console.log('linia: ', tagLine);
    allTagsHTML = allTagsHTML + tagLine + space;
  }
  tagList.innerHTML = allTagsHTML;
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
//const horizontalList = document.querySelectorAll('.post-tags .list a');

function addClickListenersToTags(){
  /* find all links to tags */
  //const href = horizontalList.getAttribute("href");
  const href = document.querySelectorAll(optArticleTagsSelector);
  const allTagLinks = document.querySelectorAll('a[href="' + href + '"]');
  //console.log('WRONG : ', allTagLinks, href);
  /* START LOOP: for each link */
  for(let allTagLink of allTagLinks){
    /* add tagClickHandler as event listener for that link */
    allTagLink.addEventListener('click', tagClickHandler);
  }
  /* END LOOP: for each link */
}

// ODKOMENTOWAC:
addClickListenersToTags(); 

const optArticleAuthorSelector = '.post-author';
const optAuthorsListSelector = '.authors.list';

function generateAuthors(){
  // find all articles //
  let authorsObj = {};
  const articles = document.querySelectorAll(optArticleSelector);
  const authorsList = document.querySelector(optAuthorsListSelector);  
  for(let article of articles){
    const wrapperFinder = article.querySelector(optArticleAuthorSelector);        
    let html = '';
    const articleAuthors = article.getAttribute("data-author");
    //const articleNumber = article.getAttribute("id");
    //const authorName = article.querySelectorAll(optAuthorsListSelector);
    const authorHTML = '<a href="#tag-' + articleAuthors + '">' + articleAuthors +'</a>';
    html = html + authorHTML;
    wrapperFinder.innerHTML = html;
    console.log('articleAuthors= ',articleAuthors);
    let authorsListHTML = '';
    let objj = [];
    //authorsAmount[articleAuthors] = 1;
    if(!authorsObj.hasOwnProperty(articleAuthors)){
      authorsObj[articleAuthors] = 1;
      authorsListHTML = authorsListHTML + articleAuthors;
      //console.log('authorsListHTML= ', authorsListHTML);
      console.log('CHECK= ',objj);
    } else {
      authorsObj[articleAuthors]++;
      //authorsAmount[articleAuthors]++;
    }
    //console.log('CHECKtab= ',objj);
    let authorLiHTML = '<li><a href="#tag-' + authorsListHTML + '">' + authorsListHTML + '</a></li>';
    objj.unshift(authorLiHTML);
    authorsList.innerHTML += objj;
    console.log('authorsObj[articleAuthors]= ', authorsObj[articleAuthors]);
    console.log('articleAuthors ', articleAuthors);
    console.log('authorsObj ', authorsObj);
  }
}

/*

function generateAuthors(){
  // find all articles //
  let authorsObj = {};
  const articles = document.querySelectorAll(optArticleSelector);
  const authorsList = document.querySelector(optAuthorsListSelector);  
  for(let article of articles){
    const wrapperFinder = article.querySelector(optArticleAuthorSelector);        
    let html = '';
    const articleAuthors = article.getAttribute("data-author");
    //const articleNumber = article.getAttribute("id");
    //const authorName = article.querySelectorAll(optAuthorsListSelector);
    const authorHTML = '<a href="#tag-' + articleAuthors + '">' + articleAuthors +'</a>';
    
    html = html + authorHTML;
    wrapperFinder.innerHTML = html;
    console.log('articleAuthors= ',articleAuthors);
    //console.log(authorsObj[articleAuthors]);
    let authorsListHTML = '';
    let objj = [];
    if(!authorsObj.hasOwnProperty(articleAuthors)){
      authorsObj[articleAuthors] = 1;
      authorsListHTML = authorsListHTML + articleAuthors;
      //console.log('authorsListHTML= ', authorsListHTML);
      let authorLiHTML = '<li><a href="#tag-' + authorsListHTML + '">' + authorsListHTML +'</a></li>';
      //authorsList.innerHTML = authorLiHTML;
      objj.unshift(authorLiHTML);
      console.log('CHECK= ',objj);
      authorsList.innerHTML += objj;
    } else {
      authorsObj[articleAuthors]++;
    }
    //console.log('CHECKtab= ',objj);
    //authorsList.innerHTML = objj;
    console.log('authorsObj[articleAuthors]= ', authorsObj[articleAuthors]);
    
  }
}

*/

generateAuthors();

/* NIEDOKONCZONE : mam zle te same funkcje dotyczace tagow */
function addClickListenersToAuthors(){
  /* find all links to tags */
  //const href = horizontalList.getAttribute("href");
  const href = document.querySelectorAll('.post-author');
  const allTagLinks = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each link */
  for(let allTagLink of allTagLinks){
    /* add tagClickHandler as event listener for that link */
    allTagLink.addEventListener('click', authorClickHandler);
  }
  /* END LOOP: for each link */
}

function authorClickHandler(event){
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
  generateTitleLinks('[data-author="' + tag + '"]');
}

addClickListenersToAuthors();