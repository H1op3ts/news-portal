let xhr = new XMLHttpRequest();

let $body = $('body');
let $newsContainer = $('.newsContainer');
let res;



createCommentForm = function() { 
  let commentForm = document.createElement('form');
  let formInputName = document.createElement('input');
  let formInputCommentContent = document.createElement('input');
  let formInputCommentSubmit = document.createElement('input');

  $(commentForm).addClass('article__comment-form');
  $(formInputName).addClass('article__comment-form-name');
  $(formInputCommentContent).addClass('article__comment-form-content');
  $(formInputCommentSubmit).addClass('article__comment-form-submit');

  commentForm.setAttribute('action', ' ');
  commentForm.name = 'comment';
  commentForm.method = 'POST';
  
  formInputName.name = 'author'
  formInputName.type = 'text';
  formInputName.placeholder = 'Представьтесь';
  
  formInputCommentContent.name = 'content';
  formInputCommentContent.type = 'text-area';
  formInputCommentContent.placeholder = 'Оставьте комментарий';
  
  formInputCommentSubmit.type = 'submit';
  formInputCommentSubmit.value = 'Отправить';

  commentForm.append(formInputName);
  commentForm.append(formInputCommentContent);
  commentForm.append(formInputCommentSubmit);
  commentsWrapper.prepend(commentForm);
}

displayLastNews = function(n, response){
   
  while (n>0)  {
    
    let article = document.createElement('div');
    $(article).addClass('article');
    
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
    expandComments.textContent = `${response[response.length - n].comments.length} комментариев`
    
    let currentArticle = response[response.length-n];
    
    title.textContent = currentArticle.title;
    category.textContent = currentArticle.categories.name;
    content.textContent = currentArticle.content.slice(0, 400)+"\u2026";
    //cut unnessesary of date 
    createdAt.textContent = 'Дата публикации: ' + currentArticle.createdAt.slice(0, 10);    
    expandContent.textContent = 'читать';
      
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

let commentsWrapper = document.createElement('div');
let commentsContainer = document.createElement('div');

$(commentsContainer).addClass('article__comments-container');
$(commentsWrapper).addClass('article__comments-wrapper--hidden');


commentsWrapper.append(commentsContainer);

createCommentForm();



xhr.open('GET', '/articles');
xhr.send();
xhr.responseType = 'json';
xhr.onload = function() {

  articles = xhr.response;
  
  displayLastNews(2, articles);

  let $expandArticle = $('.article');
  let $expandLink = $('.article__expand-button');
  let $showCommentsLink = $('.article__expand-comments-button');
  
  $expandLink.click(function(e) {
    
    currentArticle = this.parentElement;

    let articleData = articles[articles.length - 1 - $(this.parentElement).index()];

    let articleContent = currentArticle.querySelector('.article__content');
    let expandLink = currentArticle.querySelector('.article__expand-button');
    let showCommentsLink = currentArticle.querySelector('.article__expand-comments-button');

    $(currentArticle).toggleClass('article--expanded');
        
    if ($(currentArticle).hasClass('article--expanded')){
      
      articleContent.textContent = articleData.content;
      expandLink.textContent = 'свернуть';
      showCommentsLink.textContent = `показать комментарии (${articleData.comments.length})`;
     
    }
    else {

      articleContent.textContent = articleData.content.slice(0, 400)+"\u2026";
      expandLink.textContent = 'читать';
      showCommentsLink.textContent = `${articleData.comments.length} комментариев`;
            
      
      //remove commentsContainer if it exist
      $(currentArticle).children('.article__comments-container').children().remove(); 
      $(currentArticle).children('.article__comments-container').remove(); 
    }

    
      
   
  
  });
 
  $showCommentsLink.click( function(e) {       
    
    let article = articles[articles.length - 1 - $(this.parentElement).index()];
    
    
    //get total number of comments
    let commentsCount = article.comments.length;

    //get current number of comments
    let currentCommentsCount = $(commentsContainer).children().length;  

    createComment = function(data, isDataFromSubmit) {

      let comment = document.createElement('div');
      let commentHeader = document.createElement('div');
      let commentInner = document.createElement('div');
      let commentAuthor = document.createElement('p');
      let commentPublishedAt = document.createElement('p');

      
      if (isDataFromSubmit == false) {

        commentsContainer.append(comment);

      }
      else {

        commentsContainer.prepend(comment);
             
      }

      $(comment).addClass('article__comment');
      $(commentHeader).addClass('article__comment-header');
      $(commentAuthor).addClass('article__comment-author');
      $(commentInner).addClass('article__comment-content');
      $(commentPublishedAt).addClass('article__comment-published-at');
      
      commentInner.textContent = data.comments[commentsCount-1].content;
      commentAuthor.textContent = data.comments[commentsCount-1].author;
      
      let time = data.comments[commentsCount-1].createdAt;
      time = time.slice(11,19) + ' ' + time.slice(0, 10);
      commentPublishedAt.textContent = time;

      commentHeader.append(commentAuthor);
      commentHeader.append(commentPublishedAt);
      comment.append(commentHeader);
      comment.append(commentInner);


    }

    if (this.textContent == article.comments.length + " комментариев" ||
        this.textContent == "показать еще комментарии") {
      
      $(commentsWrapper).removeClass('article__comments-wrapper--hidden');
      
      commentsCount -= currentCommentsCount;
          
      let limit = commentsCount - 9;
      

      if (limit < 1) {
        
        limit = 1;
        this.textContent = 'свернуть комментарии';
             
      }

      else {
        
        this.textContent = "показать еще комментарии"
        
      }
      
     

      while (limit <= commentsCount) {

        createComment(article, false);
        commentsCount--;

      } 

    }
 
    else {
      
      this.textContent  = article.comments.length + " комментариев";
      $(commentsWrapper).addClass('article__comments-wrapper--hidden');

    }
    
    if (currentCommentsCount == 0) {
      
      this.parentElement.append(commentsWrapper);
    
    }
  
    let $comment = document.querySelector('[name = comment]');

    $comment.addEventListener('submit', function(e) {
      let xhr = new XMLHttpRequest();

      let formData = new FormData($comment);

      let object = {};

    

      formData.forEach(function(value, key){
        object[key] = value;
      });
      
      e.preventDefault()
                   
      if (JSON.stringify(article.comments[article.comments.length-1]) !== JSON.stringify(object) &&
        object.author !== '' && object.content !== '') {
        
        article.comments.push(object);  
        
        let update = {comments: article.comments};
          
        xhr.open("PUT", '/articles/' + article.id);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(update));
        xhr.onload = function() {

          res = JSON.parse(xhr.response);
          
          let submitCount = 0;
          
          commentsCount = article.comments.length - submitCount++;

          createComment(res, true);

          commentsCount--

          $comment.reset();
          
        }
      }

      
    });  
    
  });

  //pick out expand/unexpand link
  $expandArticle.on('mouseenter mouseleave', function (e) {
    $(this.querySelector('.article__expand-button')).toggleClass('article__expand-button--hovered');
  });
 
};   









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