let xhr = new XMLHttpRequest();

const $body = $('body');
const $newsContainer = $('.newsContainer');
const filter = document.querySelector('.filter');
const select = document.querySelector('.select');


//блок с комментариями и формой отправки
createCommentForm = function(element, data) { 

//создаем элементы блока
  let commentsWrapper = document.createElement('div');
  let commentsContainer = document.createElement('div');
  let commentForm = document.createElement('form');
  let formInputName = document.createElement('input');
  let formInputCommentContent = document.createElement('textarea');
  let formInputCommentSubmit = document.createElement('button');

//присваиваем классы
  $(commentsContainer).addClass('article__comments-container');
  $(commentsWrapper).addClass('article__comments-wrapper');
  $(commentForm).addClass('article__comment-form');
  $(formInputName).addClass('article__comment-form-name');
  $(formInputCommentContent).addClass('article__comment-form-content');
  $(formInputCommentSubmit).addClass('article__comment-form-submit');

//значения атрибутов
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

//добавляем все элементы
  commentsWrapper.append(commentsContainer);
  commentsWrapper.prepend(commentForm);
  commentForm.append(formInputName);
  commentForm.append(formInputCommentContent);
  commentForm.append(formInputCommentSubmit);
  
//вставляем wrapper перед кнопкой при клике
  element.before(commentsWrapper);

  commentForm.addEventListener('submit', function(e) {

    //чтобы знать куда отправлять данные
    let id = commentForm.id;
                
    let xhr = new XMLHttpRequest();

    let formData = new FormData(commentForm);

    let object = {};

    e.preventDefault()

    formData.forEach(function(value, key){
      object[key] = value;
    });
    
    //проверка полей
    if (object.author !== '' && object.content !== '') {
      
      //добавляем данные из формы в массив с комментариями
      data.comments.push(object);  

      //отправляем новый объект в БД
      let update = {comments: data.comments};
        
      xhr.open("PUT", '/articles/' + id);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(update));
      xhr.onload = function() {

        let res = JSON.parse(xhr.response);

        createComment(res, true, commentsContainer);

        commentForm.reset();
      
      }
      
    }
  
  })   

}

//генерация новостей на странице
displayLastNews = function(data, value){

  //определяем сколько новостей уже на странице
  let currentArticlesCount = $newsContainer.children().length;

  //задаем верхний предел отображаемых новостей 
  let upperLimit = data.length - 1 - currentArticlesCount;

  //задаем нижний предел отображаемых новостей 
  let lowerLimit = upperLimit - 3;

  //в случае отрицательного значения
  if (lowerLimit < 0) {
    lowerLimit = -1;
  }

  //генерируем новости в заданном диапазоне
  while (lowerLimit < upperLimit && upperLimit >= 0)  {

    //создаем элементы
    let currentArticle = data[upperLimit];

    if (currentArticle.categories.name == value || value == undefined) {
    
      
      let article = document.createElement('div');  
      let createdAt = document.createElement('p'); 
      let category = document.createElement('a');  
      let contentWrapper = document.createElement('div');
      let image = document.createElement('img'); 
      let content = document.createElement('div');  
      let title = document.createElement('h3');
      let expandContent = document.createElement('a');
      let expandComments = document.createElement('a');
      
      //присваиваем классы
      $(article).addClass('article');
      $(createdAt).addClass('article__createdAt');
      $(category).addClass('article__category');
      $(contentWrapper).addClass('article__content-wrapper');
      $(image).addClass('article__image');
      $(content).addClass('article__content');
      $(title).addClass('article__title');
      $(expandContent).addClass('article__expand-content-button');
      $(expandComments).addClass('article__expand-comments-button');

      //получаем количество комментариев у конкретной статьи
      let numberOfComments = currentArticle.comments.length;
      let strNum = numberOfComments.toString();

      //изменение окончания в зависимости от количества комментариев
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

      //задаем атрибуты
      expandComments.textContent = numberOfComments + ' комментари' + ending(); 
      title.textContent = currentArticle.title;
      category.textContent = currentArticle.categories.name;
      category.href = '/categories';
      content.textContent = currentArticle.content.slice(0, 400)+"\u2026";
      image.src = currentArticle.image.url;
      createdAt.textContent = 'Дата публикации: ' + currentArticle.createdAt.slice(0, 10);    
      expandContent.textContent = 'читать полностью';
        
      //собираем новость
      article.append(title);
      article.append(category);
      article.append(createdAt);
      contentWrapper.append(image);
      contentWrapper.append(content);
      content.append(expandContent);
      article.append(contentWrapper);
      article.append(expandComments);
      
      //добавляем новость на страницу
      $newsContainer.append(article);

      //разворачиваем содержимое статьи
      $(expandContent).click(function(e) {
        
        //задаем текущую статью по клику
        currentArticle = this.parentElement.parentElement.parentElement;

        //находим данные в БД для текущей статьи
        let articleData = articles[articles.length - 1 - $(currentArticle).index()];

        //содержимое статьи
        let articleContent = currentArticle.querySelector('.article__content');
        
        //переключаем класс
        $(currentArticle).toggleClass('article--expanded');

        //проверяем свернута или развернута статья    
        if ($(currentArticle).hasClass('article--expanded')){
          
          //меняем контент на полный
          articleContent.textContent = articleData.content;
          articleContent.append(this);
          this.textContent = 'свернуть';
    
        }
        else {
          
          //меняем контент на сокращенный
          articleContent.textContent = articleData.content.slice(0, 400)+"\u2026";
          articleContent.append(this);
          this.textContent = 'читать полностью';
    
        }
    
      });

      //разворачиваем блок с комментариями
      $(expandComments).click( function(e) { 

        //берем данные из БД для текущей статьи
        let article = data[data.length - 1 - $(this.parentElement).index()];

        //проверяем есть ли блок комментариев
        if ($(this).prev().hasClass('article__content-wrapper')) {

          //добавляем блок комментариев
          createCommentForm(this, article);   
    
        }
            
        //получаем количество комментариев
        let commentsCount = article.comments.length;
    
        //блок комментариев с формой
        let commentsWrapper = $(this).prev();
    
        //блок комментариев
        let commentsContainer = commentsWrapper.children()[1];
        
        //текущее количество комментариев в блоке
        let currentCommentsCount = $(commentsContainer).children().length;  
        
        //создание комментария
        createComment = function(data, isDataFromSubmit, container) {
    
          //создаем элементы
          let comment = document.createElement('div');
          let commentHeader = document.createElement('div');
          let commentContent = document.createElement('div');
          let commentAuthor = document.createElement('p');
          let commentPublishedAt = document.createElement('p');
          let commentDeletelink = document.createElement('a');
          let commentEditlink = document.createElement('a');
    
    
          //если вызывается при сабмите пользователем,
          //комментарий добавляется в начало блока
          if (isDataFromSubmit == false) {
    
            container.append(comment);
    
          }
          else {
            
            //количество комментариев берется из нового response при сабмите
            commentsCount = data.comments.length;
            container.prepend(comment);
                
          }
    
          //присваиваем классы
          $(comment).addClass('article__comment');
          $(commentHeader).addClass('article__comment-header');
          $(commentAuthor).addClass('article__comment-author');
          $(commentContent).addClass('article__comment-content');
          $(commentPublishedAt).addClass('article__comment-published-at');
          $(commentDeletelink).addClass('article__comment-delete-link');
          $(commentEditlink).addClass('article__comment-edit-link');

          //задаем дате нормальный формат
          let time = data.comments[commentsCount-1].createdAt;
          time = time.slice(11,19) + ' ' + time.slice(0, 10);
          
          //наполняем контентом
          commentContent.textContent = data.comments[commentsCount-1].content;
          commentAuthor.textContent = data.comments[commentsCount-1].author;
          commentEditlink.textContent = 'редактировать';
          commentDeletelink.textContent = ' удалить';
          commentPublishedAt.textContent = time;
        
          //отображение кнопок редактирования при наведении на комментарий
          $(comment).on('mouseenter mouseleave', function (e) {
        
            $(this.querySelector('.article__comment-delete-link')).toggleClass('article__comment-delete-link--visible');
            $(this.querySelector('.article__comment-edit-link')).toggleClass('article__comment-edit-link--visible');
    
          });
    
          //сборка комментария
          commentHeader.append(commentAuthor);
          commentHeader.append(commentPublishedAt);
          comment.append(commentHeader);
          comment.append(commentContent);
          comment.append(commentEditlink);
          comment.append(commentDeletelink);

          //удаление комментария
          commentDeletelink.addEventListener('click', function(e){
            
            //находим комментарий
            comment = this.parentElement;
              
            let xhr = new XMLHttpRequest();

            let id = data.id;
            
            //текущий индекс комментария
            let commentIndex = $(comment).index();
    
            //удаляем комментарий из массива
            data.comments.splice(commentsCount - commentIndex - 1, 1);
            
            //объект для отправки в БД
            let update = {comments: data.comments};
              
            xhr.open("PUT", '/articles/' + id);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(update));
            xhr.onload = function() {
              
              //удаляем из блока комментариев
              comment.remove();
            
            }
    
          })
          
          //редактирование комментария
          commentEditlink.addEventListener('click', function(e){
    
            //задаем текущий комментарий
            let currentComment = this.parentElement;
            
            //текущие данные комментария
            let currentContent = currentComment.querySelector('.article__comment-content').textContent;
            let commentAuthor = currentComment.querySelector('.article__comment-author').textContent;  
            
            //создаем элементы формы редактирования
            let editCommentForm = document.createElement('form');
            let formInput = document.createElement('textarea');
            let formSubmit = document.createElement('button');
            let formCancel = document.createElement('button');
    
            //присваиваем классы
            $(editCommentForm).addClass('article__edit-comment-form');
            $(formInput).addClass('article__edit-comment-form-input');
            $(formSubmit).addClass('article__edit-comment-form-submit');
            $(formCancel).addClass('article__edit-comment-form-cancel');
    
            //задаем атрибуты
            editCommentForm.setAttribute('action', ' ');
            editCommentForm.method = 'POST';
                    
            formInput.name = 'content';
            formInput.type = 'text';
            formInput.value = currentContent;
    
            formSubmit.textContent = 'Редактировать';
            formCancel.textContent = 'Отмена';
            
            //сборка
            editCommentForm.append(formInput);
            editCommentForm.append(formSubmit);
            editCommentForm.append(formCancel);
            
            //добавляем форму редактирования
            currentComment.append(editCommentForm)

            //убираем текущий контент и кнопки редактирования
            $(currentComment.querySelector('.article__comment-content')).addClass('article__comment-content--hidden');
            $(currentComment.querySelector('.article__comment-edit-link')).remove();
            $(currentComment.querySelector('.article__comment-delete-link')).remove();
            
            //отмена редактирования
            $(formCancel).click(function(e){
    
              e.preventDefault()

              //возвращаем кнопки редактирования
              comment.append(commentEditlink);
              comment.append(commentDeletelink);

              $(commentEditlink).toggleClass('article__comment-edit-link--visible');
              $(commentDeletelink).toggleClass('article__comment-delete-link--visible');

              //возвращаем контент
              $(currentComment.querySelector('.article__comment-content')).removeClass('article__comment-content--hidden');

              //убираем форму редактирования
              $(editCommentForm).remove();
    
            })
            
            //сабмит редактирования
            editCommentForm.addEventListener('submit', function(e) {
    
              e.preventDefault();
              
              //текущий индекс комментария
              let commentIndex = $(comment).index();
    
              let id = data.id;
          
              //получаем новые данные на случай добавления комментариев
              // и их редактирования без перезагрузки страницы
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
                
                //проверяем поля
                if (object.content !== '') {
                  
                  //автор остается прежним
                  object.author = commentAuthor;
                  
                  let xhr = new XMLHttpRequest();
                  
                  //заменяем объектом с новым контентом
                  data.comments.splice(commentsCount - commentIndex - 1, 1, object);
        
                  let update = {comments: data.comments};
                    
                  xhr.open("PUT", '/articles/' + id);
                  xhr.setRequestHeader('Content-Type', 'application/json');
                  xhr.send(JSON.stringify(update));
                  xhr.onload = function() {
                    
                    //убираем форму редактирования и возвращаем все на места
                    $(formCancel).triggerHandler('click');
                    
                    //меняем содержимое комментария на странице
                    currentComment.querySelector('.article__comment-content').textContent = object.content;
    
                  }
                  
                }
    
              }    
    
            })
          
          })
      
        }
    
        //задаем поведение в зависимости от состояния блока комментариев
        if (this.textContent.startsWith('свернуть')) {

          //сворачиваем блок комментариев
          this.textContent  = article.comments.length + " комментари" + ending();
          $(commentsWrapper).addClass('article__comments-wrapper--hidden');
          
        }
    
        else {
          
          //разворачиваем блок
          $(commentsWrapper).removeClass('article__comments-wrapper--hidden');

          //задаем количество оставшихся для отображения комментариев и лимит их отобажения
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

      //подсвечиваем ссылку разворота контента у статьи
      $(article).on('mouseenter mouseleave', function (e) {

        $(this.querySelector('.article__expand-content-button')).toggleClass('article__expand-content-button--hovered');

      });
        
      //сокращаем диапазон
      upperLimit--;

    }
    
    else {
      upperLimit--;
      lowerLimit--;
    } 
  }
  
}

createFilterForm = function() {

  let xhr = new XMLHttpRequest();
  xhr.open('GET', '/categories');
  xhr.send();
  xhr.responseType = 'json';
  xhr.onload = function() {

    let categories = xhr.response;

    let categoriesCount = categories.length;
    
    while (categoriesCount > 0) {

      let option = document.createElement('option');

      option.value = categories[categoriesCount - 1].name;
      option.textContent = categories[categoriesCount - 1].name;

      select.append(option);

      categoriesCount--;

    }

    filter.addEventListener('submit', function(e){

      e.preventDefault();

      $newsContainer.children().remove();

      let sortValue = select[select.selectedIndex].value;

      let xhr = new XMLHttpRequest();

      xhr.open('GET', '/articles');
      xhr.send();
      xhr.responseType = 'json';
      xhr.onload = function() {

        let articles = xhr.response;
  
        displayLastNews(articles, sortValue);

         //infinite scroll
        $(window).scroll(function () { 
          if ($(window).scrollTop() >= $(document).height() - $(window).height() - 10) {

            displayLastNews(articles, sortValue);

          }
  });

      }

    });

  }
 
}


xhr.open('GET', '/articles');
xhr.send();
xhr.responseType = 'json';
xhr.onload = function() {

  let articles = xhr.response;
  
  //createFilterForm()

  
  displayLastNews(articles);
 

 //infinite scroll
  $(window).scroll(function () { 
    if ($(window).scrollTop() >= $(document).height() - $(window).height() - 10) {

      displayLastNews(articles);

    }
  });
 
};   









