var $fileInput = $('.file-input');
var $droparea = $('.file-drop-area');
$('#next').hide();
$('#form_mega').hide();
$('#upload').hide();
$('#results').hide();
$('.results_page').hide();
$('.wrapper_progress').hide();




// highlight drag area
$fileInput.on('dragenter focus click', function() {
  $droparea.addClass('is-active');
});

// back to normal state
$fileInput.on('dragleave blur drop', function() {
  $droparea.removeClass('is-active');
});

// change inner text
$fileInput.on('change', function() {
  var filesCount = $(this)[0].files.length;
  var $textContainer = $(this).prev('.js-set-number');

  if (filesCount === 1) {
    // if single file then show file name
    $textContainer.text($(this).val().split('\\').pop());
  } else {
    // otherwise show number of files
    $textContainer.text(filesCount + ' files selected');
  }
  $('#next').show();
  $('#next').on("click",function(){
    $('.file-drop-area').hide();
    $('#form_mega').show();
    $('#upload').show();
    $('#upload').on("click",function(){
      $('#form_mega').hide();
      $('#upload').hide();
      $('.wrapper_progress').show();
      $('#results').show();


      $('#results').on("click",function(){
        $('.wrapper_progress').hide();
        $('#results').hide();

        $('.results_page').show();


      });


    });
    $('#next').hide();


  });

});
