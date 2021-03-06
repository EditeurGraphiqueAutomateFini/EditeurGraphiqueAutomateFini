/**
*   Edit max_total_duration property for a state
*   @module editmode/state/edit_state_maxtotalduration
*   @param {Object} d - data for the state, supplied by D3
*   @param {number} newMaxTotalDuration - the new max_total_duration property
*   @param {Object} context - the global application context (svg,force,getData,links)
*/
define(function(){
    /**
    *   @alias module:editmode/state/edit_state_maxtotalduration
    */
    var edit_state_maxtotalduration = function(d,newMaxTotalDuration,context){
        if(newMaxTotalDuration >= 0){
            d.max_total_duration = newMaxTotalDuration;
            if(context.getData.states[d.name]){
                context.getData.states[d.name].max_total_duration = parseInt(newMaxTotalDuration) || 0;
            }
        }else{
            d.max_total_duration = undefined;
            if(context.getData.states[d.name]){
                context.getData.states[d.name].max_total_duration = undefined;
            }
        }
    };
    return edit_state_maxtotalduration;
});
