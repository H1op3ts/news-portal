let xhr = new XMLHttpRequest();

const $body = $('body');
const $newsContainer = $('.newsContainer');

createCommentForm = function(element, data) { 

  let commentsWrapper = document.createElement('div');
  let commentsContainer = document.createElement('div');
  let commentForm = document.createElement('form');
  let formInputName = document.createElement('input');
  let formInputCommentContent = document.createElement('textarea');
  let formInputCommentSubmit = document.createElement('button');

  $(commentsContainer).addClass('article__comments-container');
  $(commentsWrapper).addClass('article__comments-wrapper');
  $(commentForm).addClass('article__comment-form');
  $(formInputName).addClass('article__comment-form-name');
  $(formInputCommentContent).addClass('article__comment-form-content');
  $(formInputCommentSubmit).addClass('article__comment-form-submit');

  commentForm.setAttribute('action', ' ');
  commentForm.id = data.id;
  commentForm.method = 'POST';
  
  formInputName.name = 'author'
  formInputName.type = 'text';
  formInputName.placeholder = 'Представьтесь';
  
  formInputCommentContent.name = 'content';
  formInputCommentContent.type = 'text';
  formInputCommentContent.placeholder = 'Оставьте комментарий';
 
  formInputCommentSubmit.textContent = 'Отправить';

  commentsWrapper.append(commentsContainer);
  commentForm.append(formInputName);
  commentForm.append(formInputCommentContent);
  commentForm.append(formInputCommentSubmit);
  commentsWrapper.prepend(commentForm);

  element.before(commentsWrapper);

  commentForm.addEventListener('submit', function(e) {

    let id = commentForm.id;
                
    let xhr = new XMLHttpRequest();

    let formData = new FormData(commentForm);

    let object = {};

    e.preventDefault()

    formData.forEach(function(value, key){
      object[key] = value;
    });
    
    if (object.author !== '' && object.content !== '') {
      
      data.comments.push(object);  
      
      let update = {comments: data.comments};
        
      xhr.open("PUT", '/articles/' + id);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(update));
      xhr.onload = function() {

        res = JSON.parse(xhr.response);

        createComment(res, true, commentsContainer);

        commentForm.reset();
      
      }
      
    }
  
  })   

}

displayLastNews = function(data){

  let currentArticlesCount = $newsContainer.children().length;
  
  let upperLimit = data.length - 1 - currentArticlesCount;

  let lowerLimit = upperLimit - 3;

  if (lowerLimit < 0) {
    lowerLimit = -1;
  }
   
  while (lowerLimit < upperLimit)  {

    let currentArticle = data[upperLimit];  
    let article = document.createElement('div');  
    let createdAt = document.createElement('p'); 
    let category = document.createElement('a');  
    category.href = '/categories';
    let contentWrapper = document.createElement('div');
    let image = document.createElement('img'); 
    image.src = currentArticle.image.url;
    let content = document.createElement('div');  
    let title = document.createElement('h3');
    let expandContent = document.createElement('a');
    let expandComments = document.createElement('a');
    

    $(article).addClass('article');
    $(createdAt).addClass('article__createdAt');
    $(category).addClass('article__category');
    $(contentWrapper).addClass('article__content-wrapper');
    $(image).addClass('article__image');
    $(content).addClass('article__content');
    $(title).addClass('article__title');
    $(expandContent).addClass('article__expand-content-button');
    $(expandComments).addClass('article__expand-comments-button');

    let numberOfComments = currentArticle.comments.length;
    let strNum = numberOfComments.toString();

    let ending = function() {
      if(strNum.endsWith('1') && !strNum.endsWith('11')) {
        return 'й';
      }

      else if (strNum.endsWith('2') && !strNum.endsWith('12') ||
              strNum.endsWith('3') || strNum.endsWith('4')) {
        return 'я';       
      }

      else {
        return 'ев';
      }
    
    }

    expandComments.textContent = numberOfComments + ' комментари' + ending(); 
    title.textContent = currentArticle.title;
    category.textContent = currentArticle.categories.name;
    content.textContent = currentArticle.content.slice(0, 400)+"\u2026";
    
    createdAt.textContent = 'Дата публикации: ' + currentArticle.createdAt.slice(0, 10);    
    expandContent.textContent = 'читать полностью';
      
    
    article.append(title);
    article.append(category);
    article.append(createdAt);
    contentWrapper.append(image);
    contentWrapper.append(content);
    content.append(expandContent);
    article.append(contentWrapper);
    
    article.append(expandComments);
    
    
    
    $newsContainer.append(article);

    $(expandContent).click(function(e) {
    
      currentArticle = this.parentElement.parentElement.parentElement;
      let articleData = articles[articles.length - 1 - $(currentArticle).index()];
  
      let articleContent = currentArticle.querySelector('.article__content');
          
      $(currentArticle).toggleClass('article--expanded');
          
      if ($(currentArticle).hasClass('article--expanded')){
        
        articleContent.textContent = articleData.content;
        articleContent.append(this);
        this.textContent = 'свернуть';
  
      }
      else {
  
        articleContent.textContent = articleData.content.slice(0, 400)+"\u2026";
        articleContent.append(this);
        this.textContent = 'читать полностью';
   
      }
  
    });
   
    $(expandComments).click( function(e) {  
      
      let article = articles[articles.length - 1 - $(this.parentElement).index()];
      
      if ($(this).prev().hasClass('article__content-wrapper')) {
        
        createCommentForm(this, article);   
  
      }
          
      //get total number of comments
      let commentsCount = article.comments.length;
  
      let commentsWrapper = $(this).prev();
  
      let commentsContainer = commentsWrapper.children()[1];
      
      //get current number of comments
      let currentCommentsCount = $(commentsContainer).children().length;  
      
      createComment = function(data, isDataFromSubmit, container) {
  
        let comment = document.createElement('div');
        let commentHeader = document.createElement('div');
        let commentContent = document.createElement('div');
        let commentAuthor = document.createElement('p');
        let commentPublishedAt = document.createElement('p');
        let commentDeletelink = document.createElement('a');
        let commentEditlink = document.createElement('a');
  
  
        
        if (isDataFromSubmit == false) {
  
          container.append(comment);
  
        }
        else {
          
          commentsCount = data.comments.length;
          container.prepend(comment);
               
        }
  
        $(comment).addClass('article__comment');
        $(commentHeader).addClass('article__comment-header');
        $(commentAuthor).addClass('article__comment-author');
        $(commentContent).addClass('article__comment-content');
        $(commentPublishedAt).addClass('article__comment-published-at');
        $(commentDeletelink).addClass('article__comment-delete-link');
        $(commentEditlink).addClass('article__comment-edit-link');
        
        commentContent.textContent = data.comments[commentsCount-1].content;
        commentAuthor.textContent = data.comments[commentsCount-1].author;
        commentEditlink.textContent = 'редактировать';
        commentDeletelink.textContent = ' удалить';
        
        let time = data.comments[commentsCount-1].createdAt;
        time = time.slice(11,19) + ' ' + time.slice(0, 10);
        commentPublishedAt.textContent = time;
       
        $(comment).on('mouseenter mouseleave', function (e) {
      
        $(this.querySelector('.article__comment-delete-link')).toggleClass('article__comment-delete-link--visible');
        $(this.querySelector('.article__comment-edit-link')).toggleClass('article__comment-edit-link--visible');
  
        });
  
        commentHeader.append(commentAuthor);
        commentHeader.append(commentPublishedAt);
        comment.append(commentHeader);
        comment.append(commentContent);
        comment.append(commentEditlink);
        comment.append(commentDeletelink);
  
        commentDeletelink.addEventListener('click', function(e){
          
          comment = this.parentElement;
  
          commentsCount = data.comments.length;
  
          let xhr = new XMLHttpRequest();
          
          let id = data.id;
   
          let commentIndex = $(comment).index();
  
          data.comments.splice(commentsCount - commentIndex - 1, 1);
                  
          let update = {comments: data.comments};
            
          xhr.open("PUT", '/articles/' + id);
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.send(JSON.stringify(update));
          xhr.onload = function() {
  
            comment.remove();
          
          }
   
        })
  
        commentEditlink.addEventListener('click', function(e){
  
          let currentComment = this.parentElement;
          let currentContent = currentComment.querySelector('.article__comment-content').textContent;
          let commentAuthor = currentComment.querySelector('.article__comment-author').textContent;        
  
          let editCommentForm = document.createElement('form');
          let formInput = document.createElement('input');
          let formSubmit = document.createElement('button');
          let formCancel = document.createElement('button');
  
          $(editCommentForm).addClass('article__edit-comment-form');
          $(formInput).addClass('article__edit-comment-form-input');
          $(formSubmit).addClass('article__edit-comment-form-submit');
          $(formCancel).addClass('article__edit-comment-form-cancel');
  
          editCommentForm.setAttribute('action', ' ');
          editCommentForm.method = 'POST';
                  
          formInput.name = 'content';
          formInput.type = 'text';
          formInput.value = currentContent;
  
          formSubmit.textContent = 'Редактировать';
          formCancel.textContent = 'Отмена';
  
          editCommentForm.append(formInput);
          editCommentForm.append(formSubmit);
          editCommentForm.append(formCancel);
  
          currentComment.append(editCommentForm)
          $(currentComment.querySelector('.article__comment-content')).addClass('article__comment-content--hidden');
          $(currentComment.querySelector('.article__comment-edit-link')).remove();
          $(currentComment.querySelector('.article__comment-delete-link')).remove();
     
          $(formCancel).click(function(e){
  
            e.preventDefault()
            comment.append(commentEditlink);
            comment.append(commentDeletelink);
            $(commentEditlink).toggleClass('article__comment-edit-link--visible');
            $(commentDeletelink).toggleClass('article__comment-delete-link--visible');
            $(currentComment.querySelector('.article__comment-content')).removeClass('article__comment-content--hidden');
            $(editCommentForm).remove();
  
          })
  
          editCommentForm.addEventListener('submit', function(e) {
  
            e.preventDefault();
  
            let commentIndex = $(comment).index();
  
            let id = data.id;
        
            comment = this.parentElement;
                 
            let xhr = new XMLHttpRequest();
  
            xhr.open('GET', '/articles/' + id);
            xhr.send();
            xhr.responseType = 'json';
            xhr.onload = function() {
  
              data = xhr.response;
  
              commentsCount = data.comments.length; 
  
              let formData = new FormData(editCommentForm);
  
              let object = {};
  
              formData.forEach(function(value, key){
                object[key] = value;
              });
              
              if (object.content !== '') {
                
                object.author = commentAuthor;
                
                let xhr = new XMLHttpRequest();
  
                data.comments.splice(commentsCount - commentIndex - 1, 1, object);
      
                let update = {comments: data.comments};
                  
                xhr.open("PUT", '/articles/' + id);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify(update));
                xhr.onload = function() {
  
                  $(formCancel).triggerHandler('click');
                  
                  currentComment.querySelector('.article__comment-content').textContent = object.content;
  
                }
                
              }
  
            }    
  
          })
        
        })
    
      }
  
      if (this.textContent.startsWith('свернуть')) {

        this.textContent  = article.comments.length + " комментари" + ending();
        $(commentsWrapper).addClass('article__comments-wrapper--hidden');
        
      }
   
      else {
        
        $(commentsWrapper).removeClass('article__comments-wrapper--hidden');
        commentsCount -= currentCommentsCount;
        let limit = commentsCount - 9;
     
        if (limit <= 1) {
          
          limit = 1;
          this.textContent = 'свернуть комментарии';
               
        }
  
        else {
          
          this.textContent = "показать еще комментарии"
          
        }
  
        while (limit <= commentsCount) {
  
          createComment(article, false,commentsContainer);
          commentsCount--;
  
        } 
  
        
      }
      
      
    })

    //pick out expand/unexpand link
    $(article).on('mouseenter mouseleave', function (e) {
      $(this.querySelector('.article__expand-content-button')).toggleClass('article__expand-content-button--hovered');
    });
       
    upperLimit--;
  }

  

   
}

xhr.open('GET', '/articles');
xhr.send();
xhr.responseType = 'json';
xhr.onload = function() {

  articles = xhr.response;
  
  displayLastNews(articles);
 

  //infinite scroll
  $(window).scroll(function () { 
    if ($(window).scrollTop() >= $(document).height() - $(window).height() - 10) {
      displayLastNews(articles);
    }
 });

};   









