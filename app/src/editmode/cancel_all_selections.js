/**
*   cancel all state selection
*   @module editmode/cancell_all_selection - a module that cancels all state selection
*/
define(function(){
    /**
    *   @constructor
    *   @alias module:editmode/cancell_all_selection
    */
    return function(){
        // testing if a state is being selected
        d3.selectAll(".state_container circle").each(function(d){
            // if the state is selected, undo process and remove linking class
            if(d.graphicEditor.linking){
                d.graphicEditor.linking = false;
                d3.select("#state_"+d.index).classed("linking",false);
            }
        });
    };
});
