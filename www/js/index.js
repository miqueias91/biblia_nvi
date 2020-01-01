var timeout = 5000;

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
    console.log('initialize');
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
              obj.text += '<ons-list-item><p style="font-size: 15px;"><span style="font-weight:bold;">'+i+'</span>&nbsp;'+myBook.chapters[obj.chapter - 1][capitulo][i] + "</p></ons-list-item>";
            }
          }
          $("#textoLivro").html(obj.text);
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