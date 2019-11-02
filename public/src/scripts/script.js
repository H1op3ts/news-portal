const xhr = new XMLHttpRequest();
const $comment = document.querySelector('[name = comment]');
let $body = $('body');
let $newsContainer = $('.newsContainer');
let commentsContainer;


displayLastNews = function(n, response){
   
  while (n>0)  {
    
    let article = document.createElement('div');
    $(article).addClass('article');
    $(article).attr('id', n);


    let createdAt = document.createElement('p');
    $(createdAt).addClass('article__createdAt');

    let category = document.createElement('a');
    $(category).addClass('article__category');
    category.href = '/categories';

    let content = document.createElement('div');
    $(content).addClass('article__content');
    
    

    let title = document.createElement('h3');
    $(title).addClass('article__title');

    let expandContent = document.createElement('a');
    $(expandContent).addClass('article__expand-button');

    let expandComments = document.createElement('a');
    $(expandComments).addClass('Article__expand-comments-button');
    
    let currentArticle = response[response.length-n];
    
    title.textContent = currentArticle.title;
    category.textContent = currentArticle.category.name;
    content.textContent = currentArticle.content.slice(0, 400)+"\u2026";
    //cut unnessesary of date 
    createdAt.textContent = currentArticle.createdAt.slice(0, 10);    
    expandContent.textContent = 'развернуть';
    expandComments.textContent = `показать комментарии (${currentArticle.comments.length})`;
    console.log(currentArticle.comments.length);
    
   



    //fill the article body
    article.append(title);
    article.append(category);
    article.append(content);
    article.append(createdAt);
    article.append(expandContent);
    article.append(expandComments);
    
  
    $newsContainer.prepend(article);
    
      
    
    n--
  }
  
  
  
}

xhr.open('GET', '/articles');
xhr.send();
xhr.responseType = 'json';
xhr.onload = function() {
  articles = xhr.response;
   
  displayLastNews(3, articles);

  let $expandArticle = $('.article');
  let $expandLink = $('.article__expand-button');
  let $showCommentsLink = $('.article__expand-comments-button');
  
  
  $expandLink.click(function(e) {
    console.log(this.parentElement)
    currentArticle = this.parentElement;
    let id = currentArticle.id;
    let articleContent = currentArticle.children[2];
    let expandLink = currentArticle.children[4];
    let showCommentsLink = currentArticle.children[5];

    if (articleContent.textContent.length > 401){

      articleContent.textContent = articles[articles.length-id].content.slice(0, 400)+"\u2026";
      expandLink.textContent = 'развернуть';
      showCommentsLink.classList.remove('Article__expand-comments-button--visible');
      //remove commentsContainer if it expands
      currentArticle.removeChild(currentArticle.children[currentArticle.children.length-1]); 
      
    
    }
    else {

      articleContent.textContent = articles[articles.length-id].content;
      expandLink.textContent = 'свернуть';
      showCommentsLink.classList.add('Article__expand-comments-button--visible');
      console.log(articleContent.textContent.length);

    }

    
      
   
  
  });

  $showCommentsLink.click( function(e) {
    currentArticle = this.parentElement;
    let id = currentArticle.id;
    console.log(currentArticle.lastChild.className == 'article__comments-container'  );
    //did comments already expand?
    if (currentArticle.lastChild !== undefined) { 

      commentsContainer = document.createElement('div');
      $(commentsContainer).addClass('article__comments-container');

      comment = document.createElement('div');
      $(commentsContainer).addClass('article__comment');
      comment.textContent = articles[articles.length - id].comments[id-1].content;
      console.log(articles[articles.length - id].comments[0].content);

      currentArticle.append(commentsContainer);
      commentsContainer.append(comment);
      
      
    }  
  });

  $expandArticle.mouseenter(function(e) {
    
    this.children[4].classList.add('article__expand-button--hovered');

  });

  $expandArticle.mouseleave(function(e) {

    this.children[4].classList.remove('article__expand-button--hovered');

  });


 
};    





$comment.addEventListener('submit', function(e) {
  const xhr = new XMLHttpRequest();
  e.preventDefault()
  let formData = new FormData($comment);
  let object = {};

  formData.forEach(function(value, key){
    object[key] = value;
  });

  let json = JSON.stringify(object);
  console.log(object);
  console.log(json);
  xhr.open("POST", '/comments');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(json);
  xhr.onload = function() {
    console.log(xhr.response);

    let lastComment = xhr.response;
    let comment = document.createElement('div');
    console.log(lastComment);
    comment.classList.add('comment');
    comment.textContent = object.content;
  
    $body.append(comment);
  
  }
    
});   




/* const xhr = new XMLHttpRequest();
const $comment = document.querySelector('[name = comment]');
const $submit = $('.submit');
let $body = $('body');
let comment = document.createElement('div');
 
xhr.open('GET', '/comments');
xhr.send();
xhr.responseType = 'json';
xhr.onload = function() {
  
  let comments = xhr.response
    
  if (comments[0] === undefined) {
    comment.classList.add('noComments');
    comment.textContent = "Оставьте первый комментарий"
  }
  else {
    console.log(comments);
    comment.classList.add('comment');
    comment.textContent = comments[comments.length-1].content;
  }

  $body.append(comment);
    
};    
    
$comment.addEventListener('submit', function(e) {
  const xhr = new XMLHttpRequest();
  e.preventDefault()
  let formData = new FormData($comment);
  let object = {};

  formData.forEach(function(value, key){
    object[key] = value;
  });

  let json = JSON.stringify(object);
  console.log(object);
  console.log(json);
  xhr.open("POST", '/comments');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(json);
  xhr.onload = function() {
    console.log(xhr.response);

    let lastComment = xhr.response;
    let comment = document.createElement('div');
    console.log(lastComment);
    comment.classList.add('comment');
    comment.textContent = object.content;
  
    $body.append(comment);
  
  }
    
});  
 */