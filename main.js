// ~~~~~~~~~~~~~~~~~~~~~~~~~~~PIC-VIEWER START~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var request;                         
var $current;                        
var cache = {};           
var $frame = $('#photo-viewer'); 
var $thumbs = $('.thumb');           

function crossfade($img) {         
                                
  if ($current) {                    
    $current.stop().fadeOut('slow');
  }

  $img.css({                         
    marginLeft: -$img.width() / 2,   
    marginTop: -$img.height() / 2    
  });

  $img.stop().fadeTo('slow', 1);    
  
  $current = $img;                 

}

$(document).on('click', '.thumb', function(e){ 
  var $img,                               
      src = this.href;              
      request = src;                      
  
  e.preventDefault();                     
  
  $thumbs.removeClass('active');          
  $(this).addClass('active');             

  if (cache.hasOwnProperty(src)) {        
    if (cache[src].isLoading === false) { 
      crossfade(cache[src].$img);         
    }
  } else {                          
    $img = $('<img/>');                   
    cache[src] = {               
      $img: $img,                
      isLoading: true                  
    };

    $img.on('load', function(){           
      $img.hide();                        
      $frame.removeClass('is-loading').append($img);
      cache[src].isLoading = false;
      if (request === src) {
        crossfade($img);           
        console.log($img);
      }                                   
    });

    $frame.addClass('is-loading');     

    $img.attr({                          
      'src': src,                        
      'alt': this.title || ''             
    });

  }

});


$('.thumb').eq(0).click();  
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~PIC-VIEWER END~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~燈箱效果 START~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var modal = (function() {                      

  var $window = $(window);                 
  var $modal = $('<div class="modal"/>');         
  var $content = $('<div class="modal-content"/>'); 
  var $close = $('<button role="button" class="modal-close">close</button>');

  $modal.append($content, $close);                

  $close.on('click', function(e){               
    e.preventDefault();                       
    modal.close();                             
  });

  return {                                   
    center: function() {                          
      var top = Math.max($window.height() - $modal.outerHeight(), 0) / 2;
      var left = Math.max($window.width() - $modal.outerWidth(), 0) / 2;
      $modal.css({                                
        top:top + $window.scrollTop(),        
        left:left + $window.scrollLeft()        
      });
    },
    open: function(settings) {                     
      $content.empty().append(settings.content);

      $modal.css({                                  
        width: settings.width || 'auto',     
        height: settings.height || 'auto'     
      }).appendTo('body');                          

      modal.center();                              
      $(window).on('resize', modal.center);        
    },
    close: function() {                           
      $content.empty();                             
      $modal.detach();                             
      $(window).off('resize', modal.center);       
    }
  };
}());
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~燈箱效果 END~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~TABS START~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
$('.tab-list').each(function(){                  
  var $this = $(this);                        
  var $tab = $this.find('li.active');            
  var $link = $tab.find('a');                     
  var $panel = $($link.attr('href'));          

  $this.on('click', '.tab-control', function(e) { 
    e.preventDefault();                          
    var $link = $(this),                          
        id = this.hash;                           

    if (id && !$link.is('.active')) {             
      $panel.removeClass('active');           
      $tab.removeClass('active');           

      $panel = $(id).addClass('active');        
      $tab = $link.parent().addClass('active');
    }
  });
});
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~TABS END~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~ACCORDION START~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
$(".accordion").on("click", ".accordion-control", function (e) {
  // When clicked
  e.preventDefault();
  $(this) 
    .next(".accordion-panel")
    .not(":animated") 
    .slideToggle();
});
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~ACCORDION END~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~AJAX START~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const getPeople = count => {
  // 使用 jQuery 的 $.ajax 返回一個 Promise
  return $.ajax({
    url: `https://api.randomuser.me/?results=${count}`,
    method: 'GET',
    dataType: 'json'
  }).then(response => response.results) // 成功時回傳 results
    .catch(err => Promise.reject(new Error(err.statusText || 'Request failed')));
};

const $peopleContainer = $('.people'); // 使用 jQuery 選取 DOM 元素

// 呼叫 getPeople 並處理回傳資料
$('#btn').click(function(){
  getPeople(5)
  .then(members => {
    console.log(members);
    // 使用 jQuery 的 map 和 append 處理資料並插入 HTML
    const html = members.map(person => `
      <div class="person-card">
        <img src="${person.picture.medium}" alt="${person.name.first}">
        <h3>${person.name.first} ${person.name.last}</h3>
        <p>Email: ${person.email}</p>
        <p>Phone: ${person.phone}</p>
      </div>
    `).join('');
    $peopleContainer.html(html); // 插入 HTML
  })
  .catch(error => console.error(`getPeople failed: ${error.message}`));
})

