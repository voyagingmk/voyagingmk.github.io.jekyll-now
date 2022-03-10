var sectionHeight = function() {
  var total    = $(window).height(),
      $section = $('section').css('height','auto');

  if ($section.outerHeight(true) < total) {
    var margin = $section.outerHeight(true) - $section.height();
    $section.height(total - margin - 20);
  } else {
    $section.css('height','auto');
  }
}

$(window).resize(sectionHeight);

$(function() {
  
  $("article h1, article h2").each(function(){
    console.log( "======"  + $(this).text().replace(/ /g, '-') );
    $(".nav2 ul").append("<li class='tag-" + this.nodeName.toLowerCase() + "'><a href='#" + $(this).text().replace(/ /g, '-') + "'>" + $(this).text() + "</a></li>");
    $(this).attr("id",$(this).text().replace(/ /g, '-'));
    $(".nav2 ul li:first-child a").parent().addClass("active");
  });

  
  $(".nav2 ul li").on("click", "a", function(event) {
    var position = $($(this).attr("href")).offset().top - 190;
    $("html, body").animate({scrollTop: position}, 400);
    $(".nav2 ul li a").parent().removeClass("active");
    $(this).parent().addClass("active");
    event.preventDefault();
  });

  sectionHeight();

  $('img').on('load', sectionHeight);
});
