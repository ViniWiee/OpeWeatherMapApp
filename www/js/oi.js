document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady(){
	console.log("olá");
    app.inicializarDB();
	app.carregaCidades();
	$(document).ready(function(){
		$('.modal-trigger').leanModal();
		$(".modal-trigger").click(function(){
			RunAjaxFo(cidade);
		});
		$('#buttonadd').click(function(e){
			e.stopImmediatePropagation();
			e.preventDefault();
			var titulo = $("#City").html();
			var Fav = new CityCon(titulo);
			app.insereCidade(Fav);
			app.carregaCidades();
			alert(titulo + " " + "Adicionado aos favoritos");
		});
		$('#Closebutt').click(function(e){
			cidade = $("#Cityval").val();
			RunAjax(cidade);
		});
		$("#removie").click(function(e){
			e.stopImmediatePropagation();
			e.preventDefault();
			app.limparCidades();
			app.carregaCidades();
			alert("Todas as cidades favoritas foram removidas");
		});
		$("#search").click(function(){
			$("#Cityval").val("");
		});
		$("#RemoVE").click(function(){
			var collection = app.db.getCollection("cidades");
			tit = $("#City").html();
			nome= collection.findOne({titulo:tit});
			collection.remove(nome);
			app.carregaCidades();
		})
	});
}
var CityCon = function (titulo) {
    this.titulo = titulo;
}
var app = {

    inicializarDB: function() {
        this.db = new loki('Weather.db', {
            autosave: true,
            autosaveInterval: 1000,
            autoload: true
        });
		this.db.loadDatabase();
		var collection = this.db.getCollection('cidades');

        if (!collection) {
            collection = this.db.addCollection('cidades');
        }
		var cite = collection.get(1);
        console.log(cite);
	},
	insereCidade: function(data) {
       var collection = this.db.getCollection('cidades');
       collection.insert(data);
    },
	carregaCidades: function() {

        var collection = this.db.getCollection('cidades');

        $('#Cb').empty();

        if (collection.data.length <= 0) {
                
            var modelo = '<p id="sem-cidades"> Sem Cidades Favoritas</p>';
            $('#Cb').append(modelo);                
            
        }

        collection.data.forEach(function(todo) {
            var modelo = "<p data-item-id=" + todo.$loki + "><a style = 'width:150px;'href='#' class='waves-effect waves-light btn'>" + todo.titulo +'</a></p>';
            $('#Cb').append(modelo);
        });

    },
	limparCidades: function() {
        var collection = this.db.getCollection('cidades');
        collection.clear();
    },
}
var cidade = "Concordia,BR";
var iconurl;
function RunAjax(cidade){
        $.ajax({
            method: "GET",
            url: "http://api.openweathermap.org/data/2.5/weather",
            data: {
                q: cidade,
                lang: "pt",
                units: "metric",
                APPID: "436342a4b4289e81ea02349390cd7348",
            },
            dataType: "json",
            success: function(response) {
                console.log(response);
				$("#City").html(response.name);
                $("#Atual").html(response.main.temp+"º");
                $("#Tmm").html(
                    response.main.temp_min+"&deg; a "+
                    response.main.temp_max+"&deg;"
                );
				iconurl = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
				$(".icon").html("<img src='" + iconurl  + "' style='width:70px;height:70px;'>");
				$("#CDT").html(response.weather[0].description);
				$("#hum").html(response.main.humidity);
            },
            failure: function(response) {
                console.error(response);
            }
        });
};
RunAjax(cidade);
function RunAjaxFo(cidade){
        $.ajax({
            method: "GET",
            url: "http://api.openweathermap.org/data/2.5/forecast",
            data: {
                q: cidade,
                lang: "pt",
                units: "metric",
                APPID: "436342a4b4289e81ea02349390cd7348",
            },
            dataType: "json",
            success: function(response) {
                console.log(response);
				$("#OI").remove();
				$("#Noice").append("<div id='OI'></div>")
				for(var i = 0; i < response.list.length -1;i++){
					var ICONURL= "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon;
					$("#OI").append("<p class = 'Modal-Paragraph'>"+ "Data" + ": "+  response.list[i].dt_txt + "</p>" + "<p class = 'Modal-Paragraph'>"+ "Humidade" + " :" + response.list[i].main.humidity + "</p>" + "<p class = 'Modal-Paragraph'>" + "Atual" + " :" + response.list[i].main.temp + "</p>" + "<p class = 'Modal-Paragraph'>"+"Max & Min" + " :" + response.list[i].main.temp_max +" & " +response.list[i].main.temp_min + "<img src="+ICONURL +".png" + ">" + "<h3>");
				}
            },
            failure: function(response) {
                console.error(response);
            }
        });
};
