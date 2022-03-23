/* eslint-disable no-prototype-builtins */
'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML)
}

const templates_article_author = {
  articleLinkAuthor: Handlebars.compile(document.querySelector('#template-article-author').innerHTML)
}

const templates_article_tag = {
  articleLinkTag: Handlebars.compile(document.querySelector('#template-article-tag').innerHTML)
}

const template_tag_cloud = {
  articleCloudTag: Handlebars.compile(document.querySelector('#template-tag-cloud').innerHTML)
}

const template_author_cloud = {
  articleCloudAuthor: Handlebars.compile(document.querySelector('#template-author-cloud').innerHTML)
}

//<li><a href="#tag-{{ href }}">{{ title }}</a></li>


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
  const atribut = clickedElement.getAttribute('href');
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
    const articleId = article.getAttribute('id');
    /* find the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    /* get the title from the title element */ 
    /* create HTML of the link */
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    //const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
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
  return optCloudClassPrefix + classNumber;
}

function calculateTagsParams(tags){
  const params = {
    max: 0,
    min: 999999 
  };

  for(let tag in tags){

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
    const articleTags = article.getAttribute('data-tags');
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    
    /* START LOOP: for each tag */
    for(let tag of articleTagsArray){
      /* generate HTML of the link */
      //----------------------------------------------------------------------------------------------------------
      const linkHTMLData = {href: tag, title: tag};
      const tagHTML = templates_article_tag.articleLinkTag(linkHTMLData);
      //const tagHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li> ';
      /* add generated code to html variable */
      html = html + tagHTML;
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
  /* [NEW] create variable for all links HTML code --------------------------------================= */
  //let allTagsHTML = ' ';
  const allTagsData = {tags: []};
  /* [NEW] START LOOP: for each tag in allTags */
  for(let tag in allTags){
    const className = calculateTagClass(allTags[tag], tagsParams);
    //const tagLine = '<li><a class="' + className + '" href=#tag-' + tag + '>' + tag + ' ' + '</a></li> ';
    //allTagsHTML = allTagsHTML + tagLine ;
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  }
  //tagList.innerHTML = allTagsHTML;
  tagList.innerHTML = template_tag_cloud.articleCloudTag(allTagsData);
}

generateTags();

function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
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
  const hrefTags = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for(let hrefTag of hrefTags){
    /* add class active */
    hrefTag.classList.add('active');
    /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  //const href = document.querySelectorAll(optArticleTagsSelector);
  const allTagLinks = document.querySelectorAll('a[href^="#tag-"]');
  /* START LOOP: for each link */
  for(let allTagLink of allTagLinks){
    /* add tagClickHandler as event listener for that link */
    allTagLink.addEventListener('click', tagClickHandler);
    /* END LOOP: for each link */
  }
}

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
    const articleAuthors = article.getAttribute('data-author');
    //-------------------------------------------------------------------------------------------------------
    const linkHTMLData = {href: articleAuthors, title: articleAuthors};
    const authorHTML = templates_article_author.articleLinkAuthor(linkHTMLData);
    //const authorHTML = 'by <a href="#author-' + articleAuthors + '">' + articleAuthors +'</a>';
    html = html + authorHTML;
    wrapperFinder.innerHTML = html;
    //let authorsListHTML = '';
    const authorsListHTML = {authors: []};
    if(!authorsObj.hasOwnProperty(articleAuthors)){
      authorsObj[articleAuthors] = 1;
      const count = document.querySelectorAll('.post[data-author="' + articleAuthors + '"]').length;
      //const authorListLinkHTML = '<li><a href="#author-' + articleAuthors + '">' + articleAuthors + ' (' + count + ')</a></li>';
      //authorsListHTML = authorsListHTML + authorListLinkHTML;
      authorsListHTML.authors.push({
        author: articleAuthors,
        count: count
      });
      //console.log(authorsListHTML.authors);
    }
    //authorsList.innerHTML += authorsListHTML;
    //console.log(authorsListHTML);
    authorsList.innerHTML += template_author_cloud.articleCloudAuthor(authorsListHTML);
  }
}

generateAuthors();

function addClickListenersToAuthors(){
  /* find all links to tags */
  const allTagLinks = document.querySelectorAll('a[href^="#author-"]');
  /* START LOOP: for each link */
  for(let allTagLink of allTagLinks){
    /* add tagClickHandler as event listener for that link */
    allTagLink.addEventListener('click', authorClickHandler);
    /* END LOOP: for each link */
  }
}

function authorClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#author-', '');
  /* find all tag links with class active */
  const tagLinks = document.querySelectorAll('a.active[href^="#author-"]');
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