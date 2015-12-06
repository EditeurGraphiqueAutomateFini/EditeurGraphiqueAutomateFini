define(function(){
    return{
        // initialisation function : states : array of state objects
        init : function(states){
            if(states){
                var links=[],
                    dataset=[];
                // Compute the distinct nodes from the links.
                //très moyennement satisfait du bouzin ci-dessous
                states.forEach(function(data,i){
                    var cpt=0;
                    for(var key in data){
                        var state = data[key];
                        if(data.hasOwnProperty(key)){
                            state.fixed = true;
                            state.uniqueId = cpt;
                            state.name = key;
                            state.x = state.cx || cpt*50+20;   //known position or random
                            state.y = state.cy || cpt*50+20;
                            dataset.push(state);
                        }
                        cpt++;
                    }
                    for(var key in data){
                        var state = data[key];
                        if(data.hasOwnProperty(key)){
                            if(state.transitions && state.transitions.length>0){
                                for(var i=0;i<state.transitions.length;i++){
                                    links.push({
                                        source : state.uniqueId,
                                        target :(function(data){
                                            for(var key in data){
                                                if(state.transitions[i].target==data[key].name){
                                                    return data[key].uniqueId;
                                                }
                                            }
                                        })(dataset),
                                        condition : state.transitions[i].condition
                                    });
                                }
                            }
                        }
                    }
                });
                this.createPaths("#svg_container",dataset,links);
            }else{
                //todo : vue par défaut ? basculer vers le mode creation ?
            }
        },
        //create path between states : container : html container selector, states : array of states, links : links array created w/ data array
        createPaths:function(container,states,links){
            console.log(states,links);  //affiche les tableaux d'etats et de liens (transitions) dans la console (temporaire)

            var width = 300,
                height = 300;

            //creating the force layout with states as nodes
            var force = d3.layout.force()
                .nodes(d3.values(states))
                .links(d3.values(links))
                .size([width, height])
                .linkDistance(200)
                .charge(-200)
                .on("tick",tick)
                .start();

            var svg = d3.select(container).append("svg");

            // marker creation
            svg.append("defs")
                .append("marker")
                .attr("id","end")
                .attr("viewBox","0 -5 10 10")
                .attr("refX",25)
                .attr("refY",-1)
                .attr("markerWidth",6)
                .attr("markerHeight",6)
                .attr("orient","auto")
                .append("path")
                .attr("d","M0,-5L10,0L0,5");

            //create a path for each link/transition
            var path = svg.append("g").selectAll("path")
                .data(force.links())
                .enter().append("path")
                .attr("class", function(d) {return "link "+d.source.index +"_"+d.target.index;})
                .attr("marker-end", "url(#end");

            //create a circle for each state and apply D3 drag system
            var circle = svg.append("g").selectAll("circle")
                .data(force.nodes())
                .enter().append("circle")
                .attr("r", "15")
                .attr("class",function(d){
                    if(d.terminal){return "terminal"}
                    else{return "";}
                })
                .attr("fill", function(d){return d.fill;})
                .call(force.drag);

            //create a text for each state w/ the name of the state and [max_nosie] if set
            var text = svg.append("g").selectAll("text")
                .data(force.nodes())
                .enter().append("text")
                .attr("x", 20)
                .attr("y", 0)
                .text(function(d) {
                    var text = d.name;
                    if(d.max_noise>0){
                        text+="["+d.max_noise+"]";
                    }
                    return text;
                 });

            //create a text for each transition w/ the condition of the transition
            var condition = svg.append("g").selectAll("text")
                .data(force.links())
                .enter().append("text")
                .attr("x", 20)
                .attr("y", 0)
                .text(function(d) { return d.condition; });

            // Use elliptical arc path segments to doubly-encode directionality.
            function tick(){
                path.attr("d", linkArc);
                circle.attr("transform", transform);
                text.attr("transform", transform);
                condition.attr("transform", transformCondition);
            }
            //create arc between states
            function linkArc(d){
                var dx = d.target.x - d.source.x,
                    dy = d.target.y - d.source.y,
                    dr = Math.sqrt(dx * dx + dy * dy);

                //if source is pointing toward itself, create a fixed arc
                //optimisé pour 50, a modifier/tester
                if(d.target==d.source){
                    var distance = 50,
                        dr1 = "50",
                        dr2 = "33";
                    return "M" + d.source.x + "," + d.source.y + "A" +dr1+","+dr2+ " 0 0,1 " + (d.target.x+distance) + "," + (d.target.y+distance)+
                            ",M"+(d.target.x+distance)+","+(d.target.y+distance)+"A"+dr2+","+dr1+" 0 0,1 "+d.source.x+","+d.source.y;
                }else{
                    return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
                }
            }
            //define position
            function transform(d) {
                return "translate(" + d.x + "," + d.y + ")";
            }
            //define position of transition condition
            function transformCondition(d) {
                var translate = "";
                //if source is related to itself
                if(d.source==d.target){ //todo variabiliser le 50
                    translate+="translate(" + (d.source.x+50) + "," + (d.source.y+50) + ")";
                }else{
                    translate+="translate(" + ((d.source.x+d.target.x)/2) + "," + ((d.source.y+d.target.y)/2) + ")";
                }
                return translate;
            }
        }
    }
});
