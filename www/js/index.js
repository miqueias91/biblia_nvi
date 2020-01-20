window.fn = {};
var ultimo_livro_lido = localStorage.getItem('ultimo_livro_lido');
var ultimo_livro_lido_abr = localStorage.getItem('ultimo_livro_lido_abr');
var ultimo_capitulo_lido = localStorage.getItem('ultimo_capitulo_lido');
var id = '';
var usar_cores = 0;


window.fn.toggleMenu = function () {
  document.getElementById('appSplitter').left.toggle();
};

/*window.fn.toggleMenu = function () {
  document.getElementById('appSplitter').right.toggle();
};*/

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
    if (JSON.parse(ultimo_capitulo_lido)) {
      fn.pushPage({'id': 'textoLivro.html', 'title': ultimo_livro_lido_abr+'||'+ultimo_livro_lido+'||200||'+ultimo_capitulo_lido});
    }
    else{
      fn.pushPage({'id': 'textoLivro.html', 'title': 'Gn||Gênesis||50||1'});
    }
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
  retirarMarcadorVersiculo: function(livro, num_capitulo, num_versiculo, array) {
    for(var i=0; i<array.length; i++) {
      if((array[i]['livro'] === livro) && (array[i]['num_capitulo'] === num_capitulo) && (array[i]['num_versiculo'] === num_versiculo)) {
        array.splice(i, 1);
      }
    }
    var lista_versiculos = JSON.parse(localStorage.getItem('lista-versiculos') || '[]');
    localStorage.removeItem(lista_versiculos);
    localStorage.setItem("lista-versiculos", JSON.stringify(array));
  },
  incluirMarcadorVersiculo: function(livro, num_capitulo, num_versiculo) {
    array = JSON.parse(localStorage.getItem('lista-versiculos'));
    if (array) {
      for(var k=0; k < array.length; k++) {
        if((array[k]['livro'] == livro) && (array[k]['num_capitulo'] == num_capitulo) && (array[k]['num_versiculo'] == num_versiculo)) {
          return array[k]['cor'];
        }
      }   
    }
    return false;
  },  
  retirarCapitulo: function(search_array, array) {
    for(var i=0; i<array.length; i++) {
        if(array[i] === search_array) {
          var indice = array.indexOf(search_array);
          array.splice(indice, 1);
        }
    }
    var lista_capitulos = JSON.parse(localStorage.getItem('lista-capitulos') || '[]');
    localStorage.removeItem(lista_capitulos);
    localStorage.setItem("lista-capitulos", JSON.stringify(array));
  },
  incluirCapitulo: function(search_array) {
    array = JSON.parse(localStorage.getItem('lista-capitulos'));
    if (array) {
      for(var i=0; i<array.length; i++) {
          if(array[i] === search_array) {
            return true;
          }
        return false;
      }   
      return false;   
    }
    return false;
  },  
  buscaTexto: function(version,livro,capitulo, nome) {
    localStorage.setItem("ultimo_livro_lido", nome);
    localStorage.setItem("ultimo_livro_lido_abr", livro);
    localStorage.setItem("ultimo_capitulo_lido", capitulo);

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
              var txt_marcado = 0;
              var capitulo_marcado = 0;
              var background = '#f5f5f5';
              var existe_marcado = app.incluirMarcadorVersiculo(livro, capitulo, i);
              var existe_capitulo = app.incluirCapitulo(livro+' '+capitulo);
              if (existe_marcado) {
                txt_marcado = 1;
                background = existe_marcado;
              }

              if (existe_capitulo) {
                capitulo_marcado = 1;
              }
              var texto = myBook.chapters[obj.chapter - 1][capitulo][i];
              obj.text += '<ons-list-item>'+
                            '<p style="font-size: 20px;text-align:justify;line-height: 25px;background:'+background+'"  id="txt_versiculo'+livro+'_'+capitulo+'_'+i+'" class="txt_versiculo" livro="'+livro+'" num_capitulo="'+capitulo+'" num_versiculo="'+i+'" marcado="'+marcado+'" txt_marcado="'+txt_marcado+'" txt_versiculo="'+texto+'">'+
                              '<span style="font-weight:bold;">'+i+'</span>'+
                              '&nbsp;&nbsp;'+texto+ 
                            '</p>'+
                          '</ons-list-item>';
            }
          }
          obj.text += '<br><br><section style="margin: 16px"><ons-button capitulo_marcado="'+capitulo_marcado+'" modifier="large" class="button-margin marcar_capitulo" livro_marcar="'+livro+'" num_capitulo_marcar="'+capitulo+'">MARCAR CAPÍTULO COMO LIDO</ons-button></section>'
          $("#textoLivro").html(obj.text);
        });

        $( ".marcar_capitulo" ).click(function() {
          var capitulo_marcar = $(this).attr('livro_marcar')+" "+$(this).attr('num_capitulo_marcar');
          capitulo = $(this).attr('capitulo_marcado');

          if (capitulo == 0) {
            $(this).attr('capitulo_marcado',1);
            var lista_capitulos = JSON.parse(localStorage.getItem('lista-capitulos') || '[]');
            lista_capitulos.push(capitulo_marcar);
            localStorage.setItem("lista-capitulos", JSON.stringify(lista_capitulos));
            ons.notification.toast('Capítulo marcado como lido.', { buttonLabel: 'Ok', timeout: 1500 });
          }
          else{
            $(this).attr('capitulo_marcado',0);
            lista_capitulos = JSON.parse(localStorage.getItem('lista-capitulos'));
            app.retirarCapitulo(capitulo_marcar, lista_capitulos);
            ons.notification.toast('Capítulo desmarcado como lido.', { buttonLabel: 'Ok', timeout: 1500 });
          }
        });


        $( ".txt_versiculo" ).click(function() {
          marcado = $(this).attr('marcado');
          id = $(this).attr('id');          
          var livro = $('#'+id).attr('livro');
          var num_capitulo = $('#'+id).attr('num_capitulo');
          var num_versiculo = $('#'+id).attr('num_versiculo');
          if (marcado==0) {
            usar_cores++;
            if(parseInt(usar_cores) === 1){
              $(".cores").css("display","");
              $(".copiar").css("display","");
            }
            else{
              $(".cores").css("display","none");
            }
            $('#'+id).attr('marcado',1);
            $('#'+id).attr('txt_marcado',0);
            $(".botao_controle").css("display","none");
            $('#'+id).css("background","#ccc");

            lista_versiculos = JSON.parse(localStorage.getItem('lista-versiculos'));
            app.retirarMarcadorVersiculo(livro, num_capitulo, num_versiculo, lista_versiculos);
          }
          else{
            usar_cores--;
            $(this).attr('marcado',0);
            $(this).attr('txt_marcado',0);
            if(parseInt(usar_cores) === 1){
              $(".cores").css("display","");
              $(".botao_controle").css("display","none");
            }
            else{
              $(".cores").css("display","none");
              if(parseInt(usar_cores) > 1){
                $(".botao_controle").css("display","none");
              }
              else{
                $(".botao_controle").css("display","");
                $(".copiar").css("display","none");
              }
            }              
            $('#'+id).css("background","#f5f5f5");
            lista_versiculos = JSON.parse(localStorage.getItem('lista-versiculos'));
            app.retirarMarcadorVersiculo(livro, num_capitulo, num_versiculo, lista_versiculos);
          }      
        });

        $( ".cores" ).click(function() {
          marcado = $(this).attr('marcado');
          var cor = $(this).attr('id');
          var livro = $('#'+id).attr('livro');
          var num_capitulo = $('#'+id).attr('num_capitulo');
          var num_versiculo = $('#'+id).attr('num_versiculo');
    
          if (marcado==0) {
            $('#'+id).attr('marcado',1);
            $('#'+id).attr('txt_marcado',0);
            $(".botao_controle").css("display","none");
            $(".cores").css("display","");
            $('#'+id).css("background","#f5f5f5");
            lista_versiculos = JSON.parse(localStorage.getItem('lista-versiculos'));
            app.retirarMarcadorVersiculo(livro, num_capitulo, num_versiculo, lista_versiculos);
          }
          else{
            $(".copiar").css("display","none");
            id = $("[marcado=1]").attr('id');
            $("#"+id).attr('marcado',0);
            $('#'+id).attr('txt_marcado',1);
            $(".cores").css("display","none");
            $(".botao_controle").css("display","");
            $("#"+id).css("background",cor);
            var livro = $('#'+id).attr('livro');
            var num_capitulo = $('#'+id).attr('num_capitulo');
            var num_versiculo = $('#'+id).attr('num_versiculo');

            var lista_versiculos = JSON.parse(localStorage.getItem('lista-versiculos') || '[]');
            lista_versiculos.push({cor: cor, livro: livro, num_capitulo: num_capitulo, num_versiculo: num_versiculo});
            localStorage.setItem("lista-versiculos", JSON.stringify(lista_versiculos));
            usar_cores = 0;
          }      
        });

        $( ".copiar" ).click(function() {
          var text = '';
          $("[marcado=1]").each(function() {
            var txt_versiculo = $(this).text().substr(2);
            var livro = $(this).attr('livro');
            var num_capitulo = $(this).attr('num_capitulo');
            var num_versiculo = $(this).attr('num_versiculo');
            text += txt_versiculo+' '+livro+' '+num_capitulo+':'+num_versiculo+'\n\n';
          });

          text += 'Versão: Bíblia Sagrada NVI\nLink: bit.ly/2PCUN2d';
          cordova.plugins.clipboard.copy(text);
          cordova.plugins.clipboard.paste(function (text) { 
            ons.notification.toast('Copiado para a área de transferência.', { buttonLabel: 'Ok', timeout: 2000 });
          });
          //cordova.plugins.clipboard.clear();
        });
      }
    });
  },
  buscaVersiculo: function(version,livro_capitulo_versiculo, id) {
    $("#textoLivro").html('');
    var version = version || "nvi";
    var selector = this;
    var texts = [];
    var dados0 = livro_capitulo_versiculo.split('||');
    var livro = dados0[0];
    var dados1 = dados0[1].split('.');
    var capitulo = dados1[0];
    var versiculo = dados1[1];


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
          var obj_v = {
            ref : ref,
            book : regex[1].toLowerCase(),
            chapter : parseInt(regex[2]),
            text : ""
          };

          for(i in data){
            if(data[i].abbrev == obj_v.book){
                myBook = data[i];
            }
          }
          var start = parseInt(regex[3]);
          var end = parseInt(regex[4]) || parseInt(regex[3]);


          for(var i = start; i <=  end; i++){
            if (myBook.chapters[obj_v.chapter - 1][capitulo][i]) {
                obj_v.text += '<ons-list-item>'+
                  '<p style="font-size: 20px;line-height:30px;text-align:justify">'+
                    myBook.chapters[obj_v.chapter - 1][capitulo][i] +
                  '</p>'+
                  '<p style="font-size: 15px;">'+livro.toUpperCase()+' '+capitulo+':'+i+'</p>'+
                '</ons-list-item>';
            }
          }
          $("#"+id).append(obj_v.text);
        });
      }
    });
  }
};

app.initialize();