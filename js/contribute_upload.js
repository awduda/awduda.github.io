window.URL    = window.URL || window.webkitURL;
var browse_button  = document.getElementById("browse"),
    image_area = document.getElementById("image_area"),
    useBlob   = false && window.URL; // Set to `true` to use Blob instead of Data-URL
var asyncsLeft = 0;
var image_info_list=[];
id_nums=[];
data_list=[];
num_thickness=0;
selected_image=0;

thickness_added=false;
background_added=false;
background_type_selected=false;
flag=true;
$("#center_container").css("display","none")
$("#center_container").css("opacity","0")

function readImage (file,num) {

  // Create a new FileReader instance
  // https://developer.mozilla.org/en/docs/Web/API/FileReader
  var reader = new FileReader();

  // Once a file is successfully readed:
  reader.addEventListener("load", function () {

    // At this point `reader.result` contains already the Base64 Data-URL
    // and we've could immediately show an image using
    // `elPreview.insertAdjacentHTML("beforeend", "<img src='"+ reader.result +"'>");`
    // But we want to get that image's width and height px values!
    // Since the File Object does not hold the size of an image
    // we need to create a new image and assign it's src, so when
    // the image is loaded we can calculate it's width and height:
    var image  = new Image();
    image.addEventListener("load", function () {


      // Concatenate our HTML image info
      imageInfo ={}
      imageInfo.num=num;
      imageInfo.filename=file.name;
      imageInfo.width=image.width;
      imageInfo.height=image.height;
      imageInfo.filetype=file.type;
      imageInfo.size=Math.round(file.size/1024) +'KB'

      image_info_list.push(imageInfo);
      $("#image_list_container").append('<div num= '+num+' id="image_'+num+'" class="image_thumbnail_container"></div>')
      // Finally append our created image and the HTML info string to our `#preview`
      to_populate=document.getElementById("image_"+num)
      to_populate.append(this)
      $(this).css("width",$("#image_"+num).width())
      $(this).addClass("image_thumbnail")
      //$("#image_"+num).css("background-image", "url("+reader.result+")");

    //  to_populate.insertAdjacentHTML("beforeend", "<img src='"+ reader.result +"'>");
      //preview_area.insertAdjacentHTML("beforeend", imageInfo +'<br>');

      // If we set the variable `useBlob` to true:
      // (Data-URLs can end up being really large
      // `src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAA...........etc`
      // Blobs are usually faster and the image src will hold a shorter blob name
      // src="blob:http%3A//example.com/2a303acf-c34c-4d0a-85d4-2136eef7d723"
      if (useBlob) {
        // Free some memory for optimal performance
        window.URL.revokeObjectURL(image.src);
      }
      if (--asyncsLeft==0){
        done_loading();
      }

    });

    image.src = useBlob ? window.URL.createObjectURL(file) : reader.result;

  });

  // https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
  reader.readAsDataURL(file);
}




// 1.
// Once the user selects all the files to upload
// that will trigger a `change` event on the `#browse` input
browse_button.addEventListener("change", function() {

  // Let's store the FileList Array into a variable:
  // https://developer.mozilla.org/en-US/docs/Web/API/FileList
  var files  = this.files;
  // Let's create an empty `errors` String to collect eventual errors into:
  var errors = "";

  if (!files) {
    errors += "File upload not supported by your browser.";
  }

  // Check for `files` (FileList) support and if contains at least one file:
  if (files && files[0]) {

    // Iterate over every File object in the FileList array
    for(var i=0; i<files.length; i++) {
      asyncsLeft++;
      // Let's refer to the current File as a `file` variable
      // https://developer.mozilla.org/en-US/docs/Web/API/File
      var file = files[i];

      // Test the `file.name` for a valid image extension:
      // (pipe `|` delimit more image extensions)
      // The regex can also be expressed like: /\.(png|jpe?g|gif)$/i
      if ( (/\.(png|jpeg|jpg|gif)$/i).test(file.name) ) {
        // SUCCESS! It's an image!
        // Send our image `file` to our `readImage` function!
        readImage( file,i );
      } else {
        errors += file.name +" Unsupported Image extension\n";
      }
    }


  }

  // Notify the user for any errors (i.e: try uploading a .txt file)
  if (errors) {
    alert(errors);
  }

  $("#center_container").css("display","inline")
  $(".title").animate({opacity:0},1000);
  $(".title").css("display","none")
  $("#center_container").animate({opacity:1},1500);





});

function sortChildrenDivsById(parentId) {
    var parent = document.getElementById(parentId);
    var children = $("#image_list_container").children();
    var ids = [], obj, i, len;
    for (i = 0; i < children.length; i++) {
        obj = {};
        obj.element = children[i];
        obj.idNum = parseInt(children[i].getAttribute('num'));
        ids.push(obj);
        id_nums.push(obj.idNum)
    }

    ids.sort(function(a, b) {
      return(a.idNum - b.idNum);

    });
    image_info_list.sort(function(a,b){return a.num-b.num});


     for (i = 0; i < ids.length; i++) {
         parent.appendChild(ids[i].element);
     }
}

$(window).resize(function(){
    $(".image_thumbnail").css("width",$("#image_"+0).width());
});


function done_loading(){
  make_buttons_active();
  sortChildrenDivsById("image_list_container");
  set_up_env(0)


}


function make_buttons_active(){
  $("#add_thickness").click(function(){
    create_thickness_point(num_thickness);

  });

  $("#mark_background").click(function(){

    create_background_point(num_thickness);

  });

  $("#background_selection").change(function(){

      background_type_selected=true;
      check_if_done()
    });

  $("#clear").click(function(){

    $(".search-container").remove()
    background_added=false;
    thickness_added=false;
    background_type_selected=false;
    $("#continue").unbind("click")
    $("background_selection").val("unknown")
    image_info_list[selected_image].background_data=[];
    image_info_list[selected_image].thickness_data=[];

  });

}

function check_if_done(){
  if (background_type_selected && thickness_added && background_added && flag)
  {
    flag=false;
    continue_operations();
  }
}

function continue_operations(){
  $("#continue").removeClass("disabled")

  $("#continue").click(function(){
    save_data()
    selected_image++;
    set_up_env(selected_image);
    flag=true;
    $("#continue").addClass("disabled")

  });
}


function create_thickness_point(n){

  $("#selected_image").click(function(e){
    $("#selected_image").append('<div id=t_'+n+' class="search-container" ><input id="search-box" type="text" class="search-box" name="q" /><data>Click to add thickness...</data><label for="search-box"><span></span></label></div>');
    $("#t_"+n).css("position","absolute");
    offset=$("#selected_image").offset()
    $("#t_"+n).css("margin-left",e.pageX-offset.left-20+"px");
    $("#t_"+n).css("margin-top",e.pageY-offset.top-20+"px");
    $("#selected_image").off("click");
    num_thickness++;
    $($("#t_"+n).children()[0]).change(function(){
        $($("#t_"+n).children()[0]).next().text($("#t_"+n).children()[0].value)
        thickness_added=true;
        check_if_done()

      });


  });


}

function create_background_point(){

  $("#selected_image").click(function(e){
    $("#selected_image").append('<form id=t_b class="search-container" ><input id="search-box" type="text" class="search-box" name="q" /><data>Background</data><label for="search-box"><span></span></label> <input type="submit" id="search-submit" /></form>');
    $("#t_b").css("position","absolute");
    offset=$("#selected_image").offset()
    $("#t_b").css("margin-left",e.pageX-offset.left-20+"px");
    $("#t_b").css("margin-top",e.pageY-offset.top-20+"px");
    $("#selected_image").off("click");
    num_thickness++;
    $($("#t_b").children()[0]).change(function(){
        $($("#t_b").children()[0]).next().text($("#t_b").children()[0].value)
        background_added=true;
        check_if_done()

      });
  });


}

function save_data(){
  image_data=new Object;
  image_data.num=selected_image;
  image_info_list[selected_image].thickness_data=[]
  image_info_list[selected_image].background_data=[]

  image_data.coords_list=[];
  data_points=$(".search-container");
  for (i=0;i<=data_points.length-1;i++) {

    x=$($(".search-container")[i]).css("margin-left");
    y=$($(".search-container")[i]).css("margin-top");
    if ($($(".search-container")[i]).is("#t_b")){ //if background
      data_to_add=[$($(".search-container")[i]).children()[0].value,$("#background_selection").val(),x,y]; ///replace hi with thickness from form
      image_info_list[selected_image].background_data.push(data_to_add);

    }
    else{
      data_to_add=[$($(".search-container")[i]).children()[0].value,x,y]; ///replace hi with thickness from form
      image_info_list[selected_image].thickness_data.push(data_to_add);
    }

  }
}

function set_up_env(current_image){
  load_image_for_operation(current_image);
  for (i=0; i<=$(".image_thumbnail_container").length; i++)
  {
      if (i==current_image){
          $("#image_"+i).removeClass("image_thumbnail_container_nonselect")
      }
      else{
          $("#image_"+i).addClass("image_thumbnail_container_nonselect")
      }
  }
  $('#image_list_container').animate({  scrollTop: (($('#image_'+current_image).offset().top)-($('#image_'+0).offset().top))},500);
  moveProgressBar()
  $("#continue").unbind("click")



}



function moveProgressBar() {
        var getPercent = selected_image/image_info_list.length;
        var getProgressWrapWidth = $('.progress-wrap').width();
        var progressTotal = getPercent * getProgressWrapWidth;
        var animationLength = 2500;

        // on page load, animate percentage bar to data percentage length
        // .stop() used to prevent animation queueing
        $('.progress-bar').stop().animate({
            left: progressTotal
        }, animationLength);
    }










function load_image_for_operation(image_num){



    $("#selected_image").empty()
    $("#selected_image").html($($(".image_thumbnail_container").children()[image_num]).clone());


    $($("#selected_image").children()[0]).removeClass("image_thumbnail");
    $($("#selected_image").children()[0]).addClass("operating_image");
    $($("#selected_image").children()[0]).css("width","");

    real_width=image_info_list[image_num].width;
    real_height=image_info_list[image_num].height;
    width=$(".operating_image").width();
    height=$(".operating_image").height();


    container_width=$("#selected_image_container").width();
    container_height=$("#selected_image_container").height();

    if (container_width>container_height){

      if (width>height && container_width>container_height){

        scale=container_width/width;
      }
      else{

        scale=container_height/height;
      }

    }
    else{

      if (width>height && container_width>container_height){

        scale=container_height/height;
      }
      else {

        scale=container_width/width;
      }


    }
    $($("#selected_image").children()[0]).css("height",Math.round(height*scale)+"px");
    $("#selected_image").css("width",$(".operating_image").width())
    $("#selected_image").css("height",$(".operating_image").height())
    margin_left=($("#selected_image_container").width()-$(".operating_image").width())/2
    $("#selected_image").css("margin-left",margin_left+"px")





}
