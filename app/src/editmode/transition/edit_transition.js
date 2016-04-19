define(function(){
    // conditionsToEdit : string array
    return function(d,conditionsToEdit){
        var condition_list = require("viewmode/condition_list");

         conditionsToEdit.forEach(function(element){
             if(d.conditions){
                 if(d.conditions[element.index]){
                     if(d.conditions[element.index].condition !== element.updatedValues.condition){
                         d.conditions[element.index].condition = element.updatedValues.condition;
                     }
                     if(d.conditions[element.index].matcher !== element.updatedValues.matcher){
                         d.conditions[element.index].matcher = element.updatedValues.matcher;
                     }
                     if(d.conditions[element.index].silent !== element.updatedValues.silent){
                         d.conditions[element.index].silent = element.updatedValues.silent;
                     }
                 }
             }
         });

         d3.select("text.link_"+d.source.index+"_"+d.target.index)
             .text(condition_list);
    };
});
