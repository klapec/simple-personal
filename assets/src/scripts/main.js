$(function(){
  
  function scrollToElement(selector) {
    element = $(selector);
    offset = element.offset();
    $('body').animate({
        scrollTop: offset.top
    }, 1000);
  }

  $('.site-header__about').click(function(e) {
    e.preventDefault();
    scrollToElement('#section-about');
    return;
  });

  $('.site-header__work').click(function(e) {
    e.preventDefault();
    scrollToElement('#section-work');
    return;
  });

  $('.site-header__blog').click(function(e) {
    e.preventDefault();
    scrollToElement('#section-posts-list');
    return;
  });

  $('.site-header__contact').click(function(e) {
    e.preventDefault();
    scrollToElement('#section-contact');
    return;
  });

  (function headerLocation() {
    var pathname = window.location.pathname;

    if (pathname !== "/simple-personal/") {
      $('.site-header__about, .site-header__work, .site-header__blog, .site-header__contact').unbind();
    }
  })();

  $('code').each(function(i, block) {
    hljs.highlightBlock(block);
  });

});
