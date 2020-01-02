var timeout = 5000;
// Pega a lista já cadastrada, se não houver vira um array vazio
var lista_marcadores = JSON.parse(localStorage.getItem('lista-marcadores') || '[]');
window.fn = {};

window.fn.toggleMenu = function () {
  document.getElementById('appSplitter').right.toggle();
};

window.fn.loadView = function (index) {
  document.getElementById('appTabbar').setActiveTab(index);
  document.getElementById('sidemenu').close();
};

window.fn.loadLink = function (url) {
  window.open(url, '_blank');
};

window.fn.pushPage = function (page, anim) {
  if (anim) {
    document.getElementById('appNavigator').pushPage(page.id, { data: { title: page.title }, animation: anim });
  } else {
    document.getElementById('appNavigator').pushPage(page.id, { data: { title: page.title } });
  }
};

// SCRIPT PARA CRIAR O MODAL DE AGUARDE
window.fn.showDialog = function (id) {
  var elem = document.getElementById(id);      
  elem.show();            
};

//SCRIPT PARA ESCONDER O MODAL DE AGUARDE
window.fn.hideDialog = function (id) {
  document.getElementById(id).hide();
};

var app = {
  // Application Constructor
  initialize: function() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },
  // deviceready Event Handler    
  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.
  onDeviceReady: function() {
    
    this.receivedEvent('deviceready');  
  },
  // Update DOM on a Received Event
  receivedEvent: function(id) {
    console.log('receivedEvent');
  },
  //FUNÇÃO DE BUSCA
  onSearchKeyDown: function(id) {
    if (id === '') {
      return false;
    }
    else{
      
    }
  },
  retirarMarcador: function(search_array, array) {
    for(var i=0; i<array.length; i++) {
        if(array[i] === search_array) {
          var indice = array.indexOf(search_array);
          array.splice(indice, 1);
        }
    }
    localStorage.removeItem(lista_marcadores);
    localStorage.setItem("lista-marcadores", JSON.stringify(array));
  },
  incluirMarcador: function(search_array) {
    array = JSON.parse(localStorage.getItem('lista-marcadores'));
    for(var i=0; i<array.length; i++) {
        if(array[i] === search_array) {
          return true;
        }
    }
  },  
  buscaTexto: function(version,livro,capitulo) {
    $("#textoLivro").html('');
    var version = version || "nvi";
    var selector = this;
    var texts = [];

    $.ajax({
      type : "GET",
      url : "js/"+version+".json",
      dataType : "json",
      success : function(data){
        $(selector).each(function(){
          var ref = livro+""+capitulo+".1-200";
          var reg = new RegExp('([0-9]?[a-zA-Z]{2,3})([0-9]+)[\.|:]([0-9]+)-?([0-9]{1,3})?');
          var regex = reg.exec(ref);                    
          var myBook = null;
          var obj = {
            ref : ref,
            book : regex[1].toLowerCase(),
            chapter : parseInt(regex[2]),
            text : ""
          };

          for(i in data){
            if(data[i].abbrev == obj.book){
                myBook = data[i];
            }
          }
          var start = parseInt(regex[3]);
          var end = parseInt(regex[4]) || parseInt(regex[3]);


          /*for(var i = start; i <=  end; i++){
            if (myBook.chapters[obj.chapter - 1][capitulo][i]) {
                obj.text += '<ons-list-item><p style="font-size: 15px;"><span style="font-weight:bold;">'+i+'</span>&nbsp;'+myBook.chapters[obj.chapter - 1][capitulo][i] + "</p></ons-list-item>";
            }
          }*/

          for (var i in myBook.chapters[obj.chapter - 1][parseInt(capitulo)]) {
            if (myBook.chapters[obj.chapter - 1][capitulo][i]) {
              var marcado = 0;
              var background = '#f5f5f5';
              var existe_marcado = app.incluirMarcador(livro+'||'+capitulo+'.'+i);
              
              if (existe_marcado) {
                marcado = 1;
                background = 'yellow';
              }

              obj.text += '<ons-list-item>'+
                            '<p style="font-size: 20px;text-align:justify;line-height: 25px;background:'+background+'"  id="txt_versiculo'+livro+'_'+capitulo+'_'+i+'" class="txt_versiculo" livro="'+livro+'" num_capitulo="'+capitulo+'" num_versiculo="'+i+'" marcado="'+marcado+'">'+
                              '<span style="font-weight:bold;">'+i+'</span>'+
                              '&nbsp;&nbsp;'+myBook.chapters[obj.chapter - 1][capitulo][i] + 
                            '</p>'+
                          '</ons-list-item>';
            }
          }
          obj.text += '<section style="margin: 16px"><ons-button modifier="large" class="button-margin">MARCAR CAPÍTULO COMO LIDO</ons-button></section>'
          $("#textoLivro").html(obj.text);
        });


        $( ".txt_versiculo" ).click(function() {
          var marcado = $(this).attr('marcado');
          var id = $(this).attr('id');
          var versiculo = $(this).attr('livro')+"||"+$(this).attr('num_capitulo')+'.'+$(this).attr('num_versiculo')

          if (marcado==0) {
              $('#'+id).attr('marcado',1);
              $('#'+id).css("background","yellow");
                      // Adiciona pessoa ao cadastro
              lista_marcadores.push(versiculo);
              // Salva a lista alterada
              localStorage.setItem("lista-marcadores", JSON.stringify(lista_marcadores));
          }
          else{
              $(this).attr('marcado',0);
              $(this).css("background","#f5f5f5");
              lista_marcadores = JSON.parse(localStorage.getItem('lista-marcadores'));
              app.retirarMarcador(versiculo, lista_marcadores);
          }      
        });
      }
    });
  },
  buscaVersiculo: function(version,livro_capitulo_versiculo) {
    $("#textoLivro").html('');
    var version = version || "nvi";
    var selector = this;
    var texts = [];
    var dados0 = livro_capitulo_versiculo.split('||');
    var livro = dados0[0];
    var dados1 = dados0[1].split('.');
    var capitulo = dados1[0];
    var versiculo = dados1[1];
          //console.log(versiculo)


    $.ajax({
      type : "GET",
      url : "js/"+version+".json",
      dataType : "json",
      success : function(data){
        $(selector).each(function(){
          var ref = livro+""+capitulo+"."+versiculo;
          //console.log(ref)
          var reg = new RegExp('([0-9]?[a-zA-Z]{2,3})([0-9]+)[\.|:]([0-9]+)-?([0-9]{1,3})?');
          var regex = reg.exec(ref);                    
          var myBook = null;
          var obj = {
            ref : ref,
            book : regex[1].toLowerCase(),
            chapter : parseInt(regex[2]),
            text : ""
          };

          for(i in data){
            if(data[i].abbrev == obj.book){
                myBook = data[i];
            }
          }
          var start = parseInt(regex[3]);
          var end = parseInt(regex[4]) || parseInt(regex[3]);


          for(var i = start; i <=  end; i++){
            if (myBook.chapters[obj.chapter - 1][capitulo][i]) {
                obj.text += '<ons-list-item>'+
                  '<p style="font-size: 20px;line-height:30px;text-align:justify">'+
                    myBook.chapters[obj.chapter - 1][capitulo][i] +
                  '</p>'+
                  '<p style="font-size: 15px;">'+livro.toUpperCase()+' '+capitulo+':'+versiculo+'</p>'+
                '</ons-list-item>';
            }
          }
          $("#textoVersiculo").html(obj.text);
        });
      }
    });
  }
};

app.initialize();