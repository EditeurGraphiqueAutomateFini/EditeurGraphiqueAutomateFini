(function(){

    var emptyShell = {
        main : function(){
            var data = [
                {
                    //unique id
                    uniqueId:1,
                    //object to which this is bound
                    boundTo:[2],
                    cx:30,
                    cy:30,
                    r:30,
                    fill:'blue'
                },
                {
                    uniqueId:2,
                    boundTo:[],
                    cx:120,
                    cy:120,
                    r:30,
                    fill:'red'
                }
            ];


            //drag natif d3
            var drag = d3.behavior.drag().on('drag', function() {
                d3.select(this).attr('cx', d3.event.x).attr('cy', d3.event.y);
            });

            // generation svg
            /*
            var svgContainer = d3.select("#svg_container").append("svg").attr("width",200).attr("height",200);
            var circles = svgContainer.selectAll("circle").data(data).enter().append("circle");
            var circlesAttr = circles.attr("cx",function(d){return d.cx;}).attr("cy",30).attr("r",30).attr("fill",function(d){return d.fill;}).call(drag);
            */

            //generation div
            var svgContainer = d3.select("#svg_container");
            var circles = svgContainer.selectAll(".circle").data(data).enter().append("div").attr("class","circle");
            var circlesAttr = circles.attr({
                "style":function(d){
                    var divStyles ='background:'+d.fill+';height:'+(d.r*2)+'px;width:'+(d.r*2)+'px;left:'+d.cx+'px;top:'+d.cy+'px;';
                    return divStyles;
                },
                "id":function(d){
                    return d.uniqueId;
                }
            });

            this.displayObject(data,"#object_container");
            this.enableDragNDrop('#svg_container');
            this.createPath(circles);
        },
        displayObject : function(object,selector){      //displays an JS object on screen; object : array of object to display, selector : html tag collection to display the object in
            //todo mettre dans un textarea
            //todo gerer objets de plus d'un niveau de profondeur
            var objString = '';     //string which will contain the written object
            var indent = 20;    //indent in px

            for(var i=0;i<object.length;i++){   //iteration over the object array
                 //each object in the object array begins with a curl
                objString+='<span style="padding-left:'+indent+'px'+';"></span>{<br/>';
                for (key in object[i]){
                    if(object[i].hasOwnProperty(key)){
                        objString+='<span style="padding-left:'+indent*2+'px'+';"></span>';
                        if(typeof(object[i][key])=='string'){
                            objString+=key+' : '+'\''+object[i][key]+'\'';
                        }else{
                            objString+=key+' : '+object[i][key];
                        }
                        objString+=",<br/>";
                    }
                }
                //removing last coma
                if(objString.charAt(objString.length-6)==','){
                    objString=objString.slice(0,-6)+objString.slice(-5);
                };
                //removing last backspace
                if(objString.slice(-5)=="<br/>"){
                    objString=objString.slice(0,-5);
                }
                //each object in the object array ends with a curl
                objString+='<br/><span style="padding-left:'+indent+'px'+';"></span>}'
                if(!i==object.length-1){
                    objString+='<br/>';
                }
            }
            $(selector).html('{<br/>'+objString+'<br/>}');
        },
        enableDragNDrop : function(parent){     //enables dragndrop on each circle child of the parent
            $(parent).find('.circle').each(function(){
                $(this)
                    .draggable({
                        containment : parent,
                        zIndex: 10,
                        revert:'valid',
                        drag:function(e,obj){
                            d = $("path."+obj.helper[0].id);
                            dAttr = $("path."+obj.helper[0].id).attr("d");
                            d.attr("d",function(){
                                return "M "+e.clientX+" "+e.clientY+dAttr.slice((dAttr.indexOf("L")));
                            });
                        },
                        revertDuration:100
                    })
                    .droppable({
                        accept:'.circle',
                        tolerance:'touch'
                    });
            });
            //version svg
            /*$(parent).find('circle').each(function(){
                $(this)
                    .draggable({
                        containment : parent
                    })
                    .bind('mousedown', function(event,ui){
                        // bring target to front
                        $(event.target.parentElement).append( event.target);
                    })
                    .bind('drag',function(event,ui){
                        // update coordinates manually, since top/left style props don't work on SVG
                        $(event.target).attr('cx',function(){
                            var radius = parseInt($(this).attr('r'));
                            return ui.position.left+radius;
                        });
                        $(event.target).attr('cy',function(){
                            var radius = parseInt($(this).attr('r'));
                            return ui.position.top+radius;
                        });
                    });
            });*/
        },
        createPath:function(circles){
            //color of the lines
            var color='black';
            //width of the lines
            var stroke_width='2'
            circles.each(function(el){
                // check if circle is bound, if so get bind coordinates
                var isBound={
                    is:false,
                    bindCx:0,
                    bindCy:0,
                    bindR:0
                };
                if(el.boundTo.length>0){
                    var bound = el.boundTo;
                    circles.each(function(el){
                        for(var i=0;i<bound.length;i++){
                            if(bound[i]==el.uniqueId){
                                isBound.is=true;
                                isBound.bindCx=el.cx;
                                isBound.bindCy=el.cy;
                                isBound.bindR=el.r;
                            }
                        }
                    });
                };
                if(isBound.is){
                    var svgMarker='<defs><marker id="markerArrow" markerWidth="13" markerHeight="13" refX="2" refY="6" orient="auto"><path d="M2,2 L2,11 L10,6 L2,2" fill="black"/></marker></defs>';
                    var newSvgPath = d3.select("#svg_container").append("svg");
                    newSvgPath.html(svgMarker);
                    newSvgPath.append("path").attr({
                        "class":el.uniqueId,
                        "d":"M "+(el.cx+el.r)+" "+(el.cy+el.r)+" L "+(isBound.bindCx+isBound.bindR)+" "+(isBound.bindCy+isBound.bindR),
                        "stroke":color,
                        "stroke-width":stroke_width,
                        "marker-end":"url(#markerArrow)"
                    });
                }
            });
        }
    };

    emptyShell.main();

})();
