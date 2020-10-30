window.fn = {};
$("#existeProximoCapitulo").val(0)
var ultimo_livro_lido = localStorage.getItem('ultimo_livro_lido');
var ultimo_livro_lido_abr = localStorage.getItem('ultimo_livro_lido_abr');
var ultimo_capitulo_lido = localStorage.getItem('ultimo_capitulo_lido');
var id = '';
var usar_cores = 0;
var fonte_versiculo = JSON.parse(localStorage.getItem('fonte-versiculo') || '20');
localStorage.setItem("fonte-versiculo", fonte_versiculo);
var modo_noturno = JSON.parse(localStorage.getItem('modo-noturno') || false);
localStorage.setItem("modo-noturno", modo_noturno);
var inicioLeitura = 0;
var velocidade = 0;
var tamanho = 826;
var pausar = 0;
var rolagem = 0;
var lista_notificacao = JSON.parse(localStorage.getItem('lista-notificacoes') || '[]');


window.fn.toggleMenu = function () {
  document.getElementById('appSplitter').left.toggle();
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



var showTemplateDialog = function() {
  var dialog = document.getElementById('my-dialog');

  if (dialog) {
    dialog.show();
  } else {
    ons.createElement('dialog.html', { append: true })
      .then(function(dialog) {
        dialog.show();
      });
  }
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
    var userCadastrado = window.localStorage.getItem('userCadastrado');
    this.oneSignal();
    this.getIds();
    
    if (JSON.parse(ultimo_capitulo_lido)) {
      fn.pushPage({'id': 'textoLivro.html', 'title': ultimo_livro_lido_abr+'||'+ultimo_livro_lido+'||200||'+ultimo_capitulo_lido});
    }
    else{
      fn.pushPage({'id': 'textoLivro.html', 'title': 'Gn||Gênesis||50||1'});
    }
  },
  oneSignal: function() {

    //START ONESIGNAL CODE
    //Remove this method to stop OneSignal Debugging 
    window.plugins.OneSignal.setLogLevel({logLevel: 6, visualLevel: 0});

    var notificationOpenedCallback = function(jsonData) {
      localStorage.setItem("existe-notificacao", true);

      var mensagem = JSON.parse(JSON.stringify(jsonData['notification']['payload']['additionalData']['mensagem']));
      var titulo = JSON.parse(JSON.stringify(jsonData['notification']['payload']['additionalData']['titulo']));
      var data_notificacao = JSON.parse(JSON.stringify(jsonData['notification']['payload']['additionalData']['data_notificacao']));

      notificacoes = JSON.parse(localStorage.getItem('lista-notificacoes'));
      if (notificacoes) {
        var id_not = notificacoes.length;

      }
      else{
        id_not = 0;
      }

      lista_notificacao.push({id: id_not, titulo: titulo, mensagem: mensagem, data_notificacao: data_notificacao});
      localStorage.setItem("lista-notificacoes", JSON.stringify(lista_notificacao));
      notificacoes = JSON.parse(localStorage.getItem('lista-notificacoes'));
    
      ons.notification.alert({
        message: 'Você recebeu uma notificação, clique em [OK] para abrir!',
        title: 'Mensagem',
        callback: function (index) {
          if (0 == index) {
            fn.pushPage({'id': 'notificacao.html', 'title': 'Notificação||'+id_not});
          }
        }
      });
    };

    // Set your iOS Settings
    var iosSettings = {};
    iosSettings["kOSSettingsKeyAutoPrompt"] = false;
    iosSettings["kOSSettingsKeyInAppLaunchURL"] = false;

    window.plugins.OneSignal
    .startInit("aa08ceb7-09b5-42e6-8d98-b492ce2e5d40")
    .handleNotificationOpened(notificationOpenedCallback)
    .iOSSettings(iosSettings)
    .inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.Notification)
    .endInit();
    //END ONESIGNAL CODE
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
    inicioLeitura = 0;
    localStorage.setItem("ultimo_livro_lido", nome);
    localStorage.setItem("ultimo_livro_lido_abr", livro);
    localStorage.setItem("ultimo_capitulo_lido", capitulo);
    fonte_versiculo = JSON.parse(localStorage.getItem('fonte-versiculo'));
    modo_noturno = JSON.parse(localStorage.getItem('modo-noturno'));

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
          var reg = new RegExp('([0-9]?[a-zA-Záàâãéèêíïó]{2,3})([0-9]+)[\.|:]([0-9]+)-?([0-9]{1,3})?');
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

          for (var i in myBook.chapters[obj.chapter - 1]) {
            if (myBook.chapters[obj.chapter - 1]) {
              $("#existeProximoCapitulo").val(1);
              var marcado = 0;
              var txt_marcado = 0;
              var capitulo_marcado = 0;
              var background = '#f5f5f5';
              var color = '1f1f21';
              var existe_marcado = app.incluirMarcadorVersiculo(livro, capitulo, i);
              var existe_capitulo = app.incluirCapitulo(livro+' '+capitulo);
              if (modo_noturno) {
                background = '#333';
                color = 'fff';
              }

              if (existe_marcado) {
                txt_marcado = 1;
                background = existe_marcado;
                color = '1f1f21';
              }

              if (existe_capitulo) {
                capitulo_marcado = 1;
              }

              var texto = myBook.chapters[obj.chapter - 1][i];
              obj.text += '<ons-list-item style="background:'+background+';color:#'+color+'" id="txt_versiculo'+livro+'_'+capitulo+'_'+i+'_">'+
                            '<p style="font-size: '+fonte_versiculo+'px;text-align:justify;line-height: 35px;background:'+background+';color:#'+color+'"  id="txt_versiculo'+livro+'_'+capitulo+'_'+i+'" class="txt_versiculo" livro="'+livro+'" num_capitulo="'+capitulo+'" num_versiculo="'+i+'" marcado="'+marcado+'" txt_marcado="'+txt_marcado+'" txt_versiculo="'+texto+'">'+
                              '<span style="font-weight:bold;">'+(parseInt(i)+1)+'</span>'+
                              '&nbsp;&nbsp;'+texto+ 
                            '</p>'+
                          '</ons-list-item>';
            }
          }

          if (parseInt($("#existeProximoCapitulo").val()) == 1) {
            obj.text += '<br><br><section style="margin: 16px"><ons-button capitulo_marcado="'+capitulo_marcado+'" modifier="large" class="button-margin marcar_capitulo" livro_marcar="'+livro+'" num_capitulo_marcar="'+capitulo+'">MARCAR CAPÍTULO COMO LIDO</ons-button></section>'
            $("#textoLivro").html(obj.text);

          }
          else{
            $("#atual").val(parseInt($("#atual").val())-1);
            localStorage.setItem("ultimo_capitulo_lido", parseInt($("#atual").val()));
            $('#textoLivro_ div.center').html(ultimo_livro_lido+' '+parseInt($("#atual").val()));
            app.buscaTexto('nvi',ultimo_livro_lido_abr,parseInt($("#atual").val()), ultimo_livro_lido);
          }
          $("#existeProximoCapitulo").val(0);
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
          if (parseInt(rolagem) == 0) {
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
                $(".compartilha").css("display","");
              }
              else{
                $(".cores").css("display","none");
              }
              $('#'+id).attr('marcado',1);
              $('#'+id).attr('txt_marcado',0);
              $(".botao_controle").css("display","none");

              color = '#fff';
              modo_noturno = JSON.parse(localStorage.getItem('modo-noturno'));
              if (modo_noturno) {
                color = '#333';
              }
              $('#'+id).css("color",color);
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
                $(".compartilha").css("display","none");
                }
              }
              background = '#f5f5f5';
              color = '#1f1f21';
              modo_noturno = JSON.parse(localStorage.getItem('modo-noturno'));
              if (modo_noturno) {
                background = '#333';
                color = '#fff';
              }
              $('#'+id).css("background",background);
              $('#'+id).css("color",color);
              lista_versiculos = JSON.parse(localStorage.getItem('lista-versiculos'));
              app.retirarMarcadorVersiculo(livro, num_capitulo, num_versiculo, lista_versiculos);
            }      
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
            $(".compartilha").css("display","none");
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
      }
    });
  },
  rolar: function() {
    tamanho = $("#textoLivro").height();
    document.getElementById('onsPageTextoLivro').scrollTop = inicioLeitura;
    inicioLeitura++;
    if (inicioLeitura != tamanho && velocidade != 0) {
      t = setTimeout(function() { app.rolar() }, velocidade);
    }
  },
  parar: function() {
    clearTimeout(t);
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
            if (myBook.chapters[obj_v.chapter - 1][i]) {
                obj_v.text += '<ons-list-item>'+
                  '<p style="font-size: 20px;line-height:30px;text-align:justify">'+
                    myBook.chapters[obj_v.chapter - 1][i] +
                  '</p>'+
                  '<p style="font-size: 15px;">'+livro.toUpperCase()+' '+capitulo+':'+(parseInt(i)+1)+'</p>'+
                '</ons-list-item>';
            }
          }
          $("#"+id).append(obj_v.text);
        });
      }
    });
  },
  buscaVersiculoDia: function(version,livro_capitulo_versiculo, id) {
    $("#textoLivro").html('');
    var version = version || "nvi";
    var selector = this;
    var texts = [];
    var dados0 = livro_capitulo_versiculo.split('||');
    var livro = dados0[0];
    var dados1 = dados0[1].split('.');
    var capitulo = dados1[0];
    var versiculo = (dados1[1]-1);
    $.ajax({
      type : "GET",
      url : "js/"+version+".json",
      dataType : "json",
      success : function(data){
        $(selector).each(function(){
          var ref = livro+""+capitulo+"."+versiculo;
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
            console.log(myBook)
            console.log(myBook.name)
            if (myBook.chapters[obj_v.chapter - 1][i]) {
                obj_v.text += '<ons-list-item onclick="fn.pushPage({\'id\': \'textoLivro.html\', \'title\': \''+myBook.abbrev+'||'+myBook.name+'||'+myBook.chapters.length+'||'+(parseInt(capitulo))+'\'});">'+

                  '<p style="font-size: 20px;line-height:30px;text-align:justify">'+
                    myBook.chapters[obj_v.chapter - 1][i] +
                  '</p>'+
                  '<p style="font-size: 15px;">'+livro.toUpperCase()+' '+capitulo+':'+(parseInt(i)+1)+'</p>'+
                '</ons-list-item>';
            }
          }
          $("#"+id).append(obj_v.text);
        });
      }
    });
  },
  buscaHinario: function(version,id) {
    var version = version || "harpa";
    var selector = this;
    var texto = "";

    $.ajax({
      type : "GET",
      url : "js/"+version+".json",
      dataType : "json",
      success : function(data){
        $(selector).each(function(){
          var myBook = null;
          var obj = {
            id : id,
            text : ""
          };
          background = '#f5f5f5';
          color = '1f1f21';
          modo_noturno = JSON.parse(localStorage.getItem('modo-noturno'));
          if (modo_noturno) {
            background = '#333';
            color = 'fff';
          }
          if (modo_noturno) {
            background = '#333';
            color = 'fff';
          }

          if (data) {
            for(i in data){
              if(data[i].id == obj.id){
                  myBook = data[i];
              }
            } 
            for (var i = 0; i < myBook['hinario'].length; i++) {
              texto = myBook['hinario'][i];

              obj.text += 
              '<ons-list-item style="background:'+background+';color:#'+color+'">'+
                '<p style="font-size: '+fonte_versiculo+'px;text-align:justify;line-height: 30px;background:'+background+';color:#'+color+'">'+
                  ''+texto+ 
                '</p>'+
              '</ons-list-item>';
            }
          }
          $("#conteudoHarpa").html(obj.text);
        });
      }
    });
  },
  listaHinario: function(version) {
    var version = version || "harpa";
    var text = "";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        $("#listaharpa").html('');
        var data = JSON.parse(this.responseText);
        data.forEach(function (hinos) {
          text +=
          '<ons-list-item class="showAd" onclick="fn.pushPage({\'id\': \'conteudoHarpa.html\', \'title\': \''+hinos['id']+'||'+hinos['titulo']+'\'})">'+
          '  <div class="left"></div>'+
          '  <div class="center" style="font-size: 15px;">'+hinos['id']+' - '+hinos['titulo']+'</div>'+
          '  <div class="right"><ons-icon icon="fa-angle-right"></ons-icon></div>'+
          '</ons-list-item>';
        });
        $("#listaharpa").html(text);
      }
    };
    xmlhttp.open("GET", "js/"+version+".json", true);
    xmlhttp.send();
  },
  pesquisaHarpa: function(term){
    if (term != '') {
      term = term.toLowerCase();
      text = '';
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          $("#resultado_pesquisa_harpa").html('');
          var data = JSON.parse(this.responseText);
          data.forEach(function (hinos) {
            var achou = false;
            hinos['hinario'].forEach(function (hino) {
              if (!achou) {
                str = hino.toLowerCase();
                if(str.match(term)){
                  achou = true;
                  text +=
                  '<ons-list-item class="showAd" onclick="fn.pushPage({\'id\': \'conteudoHarpa.html\', \'title\': \''+hinos['id']+'||'+hinos['titulo']+'\'})">'+             
                  '  <div class="center" style="font-size: 15px;display:block;"><span>'+hinos['id']+' - '+hinos['titulo']+'</span>'+
                  '   <div><i style="font-size: 11px;">'+str+'</i></div>'+
                  '  </div>'+
                  '</ons-list-item>';
                }
              }
            });
          });
          if (text === '') {
            text = '<p style="text-align: center; margin: 0 0 10px 0;">Nenhum resultado encontrado</p>';
          }
          $("#resultado_pesquisa_harpa").html(text);
          $("#resultado_pesquisa_harpa").css("display","");
        }
      };
      xmlhttp.open("GET", "js/harpa.json", true);
      xmlhttp.send();
    }
  },
  pesquisaBiblia: function(term){
    if (term != '') {
      term = term.toLowerCase();
      text = '';
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          $("#resultado_pesquisa_biblia").html('');
          var data = JSON.parse(this.responseText);
          data.forEach(function (biblia) {
            var achou = false;
            var num_cap_busca = 0;
            biblia['chapters'].forEach(function (versiculos) {
              for (var i = 0; i < versiculos.length; i++) {
                if (!achou) {
                  str = versiculos[i].toLowerCase();
                  if(str.match(term)){
                    achou = true;
                    text +=
                    '<ons-list-item onclick="fn.pushPage({\'id\': \'textoLivro.html\', \'title\': \''+biblia['abbrev']+'||'+biblia['name']+'||'+biblia['chapters'].length+'||'+(parseInt(num_cap_busca)+1)+'\'});">'+
                      '<p style="font-size: 20px;line-height:30px;text-align:justify">'+
                        versiculos[i] +
                      '</p>'+
                      '<p style="font-size: 15px;">'+biblia['abbrev'].toUpperCase()+' '+(parseInt(num_cap_busca)+1)+':'+(parseInt(i)+1)+'</p>'+
                    '</ons-list-item>';
                  }
                }
              }
              num_cap_busca = num_cap_busca + 1;
            });
          });
          if (text === '') {
            text = '<p style="text-align: center; margin: 0 0 10px 0;">Nenhum resultado encontrado</p>';
          }
          $("#resultado_pesquisa_biblia").html(text);
          // $("#resultado_pesquisa_biblia").css("display","");
        }
      };
      xmlhttp.open("GET", "js/nvi.json", true);
      xmlhttp.send();
    }
  },
  dateTime: function() {
    let now = new Date;
    let ano = now.getFullYear();
    let mes = now.getMonth() + 1;
    let dia = now.getDate();

    let hora = now.getHours();
    let min = now.getMinutes();
    let seg = now.getSeconds();

    if (parseInt(mes) < 10) {
      mes = '0'+mes;
    }
    if (parseInt(dia) < 10) {
      dia = '0'+dia;
    }
    if (parseInt(hora) < 10) {
      hora = '0'+hora;
    }
    if (parseInt(min) < 10) {
      min = '0'+min;
    }
    if (parseInt(seg) < 10) {
      seg = '0'+seg;
    }
    return ano+'-'+mes+'-'+dia+' '+hora+':'+min+':'+seg;
  },
  getIds: function() {
    var userCadastrado = window.localStorage.getItem('userCadastrado');
    userCadastrado = false;
    if (!userCadastrado) {
      var userId = window.localStorage.getItem('userId');
      var uid = window.localStorage.getItem('uid');

      if (1) {
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            window.localStorage.setItem('uid',uid);
          }
        }); 
      }

      if (1) {
        window.plugins.OneSignal.getIds(function(ids) {
          window.localStorage.setItem('userId', ids.userId);
          window.localStorage.setItem('pushToken', ids.pushToken);
        });
      }

      this.cadastraUser();
    }
  },
  cadastraUser: function() {
    var userId = window.localStorage.getItem('userId');
    var pushToken = window.localStorage.getItem('pushToken');
    var uid = window.localStorage.getItem('uid');

    if (userId && uid) {
      $.ajax({
        url: "https://www.innovatesoft.com.br/webservice/app/cadastraUser.php",
        dataType: 'html',
        type: 'POST',
        data: {
          'userId': userId,
          'pushToken': pushToken,
          'uid': uid,
          'datacadastro': this.dateTime(),
          'ultimoacesso': this.dateTime(),
        },
        error: function(e) {
        },
        success: function(a) {
          window.localStorage.setItem('userCadastrado', true);          
        },
      });
    }
  },
  registraAcesso: function(pagina) {
    if (window.localStorage.getItem('uid')) {
      $.ajax({
        url: "https://www.innovatesoft.com.br/webservice/app/registraAcesso.php",
        dataType: 'json',
        type: 'POST',
        data: {
          'pagina': pagina,
          'origem': window.localStorage.getItem('uid')
        },
      });
    }
  }
};

app.initialize();
