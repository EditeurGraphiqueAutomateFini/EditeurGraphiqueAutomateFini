/*
define(function(require){
    return function(mode){
        var $ = require("jquery");
        var server = require("../utility/server_request");
        // return menu value (view : viewmode, edit: editmode)
        if(location.href.indexOf("edit") != -1){  //pour éviter d'avoir le menu en test, ajouter "?edit=1" au bout de son url
            // exemple file:///D:/Martin/_Cours/IUT/Projet%20tuteur%C3%A9/Editeur_graphique_projet/index.html?edit=1
            server.getRequest("edit"); // Editor mode
        }else if(location.href.indexOf("view") != -1){
            server.getRequest("view");
        }else{
            // code ici pour définir le menu
            $(document).ready(function(){
                $("body").prepend("<div class='menu'></div>");
                $(".menu").html(
                    "<ul id='menu' class='list-group'>"+
                        "<li id='view' class='list-group-item'>"+
                            "<a href='#' class='list-group-item'>Mode vue</a>"+
                        "</li>"+
                        "<li id='edit' class='list-group-item'>"+
                            "<a href='#' class='list-group-item'>Mode edition</a>"+
                        "</li>"+
                    "</ul>"
                );

                var li = document.getElementById("menu").getElementsByTagName("li"),
                liItem,id;

                for(var i=0; i < li.length; i++){
                liItem = document.getElementById(li[i].id);
                liItem.addEventListener("click",function(e){
                    id = this.id;
                    e.preventDefault(); // blocks the click event
                    switch(id){   // checking clicked element's id value
                        case "view":
                            server.getRequest("view");  // View mode
                            break;
                        case "edit":
                            server.getRequest("edit"); // Editor mode
                            break;
                        case "create":
                            break;
                        default:
                            server.getRequest("view");
                    }
                    $(".menu").hide();
                });
                }
            });
        }
    };
});
*/
