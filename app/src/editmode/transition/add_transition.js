// add transition array to the global object
define(function(){
    return function(force,object,source,target,condition){

        // edit global object
        var state = object.states[source.name],
            transition = {
                "condition" : condition,
                "target" : target.name
            };

        if(state){
            if(state.transitions){
                state.transitions.push(transition);
            }else{
                state.transitions = [transition];
            }
        }

        // edit links
        var testPresence = force.links().find(function(el){ return el.source.index === source.index && el.target.index === target.index; });
        if(testPresence){
            force.links().forEach(function(link){
                if(link.source.index === source.index && link.target.index === target.index){
                    if(!link.conditions){
                        link.conditions = [];
                    }
                    link.conditions.push(transition);
                }
            });
        }else{
            force.links().push({
                "conditions" : [transition],
                "source" : source,
                "target" : target
            });
        }

        // restart force layout
        force.start();
    };
});