define(function(require){
        return function (d,context){
            var edit_state = require("editmode/state/edit_state"),
                delete_state = require("editmode/state/delete_state"),
                cancel_selection = require("editmode/cancel_selection"),
                undo = require("utility/undo"),
                edit_frontend_object = require("editmode/edit_frontend_object");

            swal({
                title : (d.name ? d.name : "New state"),
                text : displayStateAsList(d),
                html : true,
                showCancelButton : true,
                closeOnConfirm : false,
                animation : "slide-from-top"
            },function(inputValue){
                if(inputValue){
                    var newName = "",
                        newTerminal = false,
                        newMaxNoise = 0,
                        newMaxTotalNoise = 0,
                        newMaxDuration = 0,
                        newMaxTotalDuration = 0,
                        newValues,
                        newDefaultTransition = {
                            "condition":"",
                            "target":0
                        };

                    // name
                    newName = d3.select("#input_name_"+d.index).property("value");
                    // terminal
                    newTerminal = d3.select("#input_terminal_"+d.index).property("checked");
                    // max_noise
                    newMaxNoise = parseInt(d3.select("#input_max_noise_"+d.index).property("value"));
                    // max_total_noise
                    newMaxTotalNoise = parseInt(d3.select("#input_max_total_noise_"+d.index).property("value"));
                    // max_duration
                    newMaxDuration = parseInt(d3.select("#input_max_duration_"+d.index).property("value"));
                    // max_total_duration
                    newMaxTotalDuration = parseInt(d3.select("#input_max_total_duration_"+d.index).property("value"));
                    // default_transition
                    newDefaultTransition.silent = d3.select("#input_default_transition_silent_"+d.index).property("checked");
                    newDefaultTransition.target = d3.select("#input_default_transition_target_"+d.index).property("value");

                    // tests
                    if(newName === ""){
                        swal.showInputError("a state must have a name");
                        return false;
                    }
                    if(newMaxNoise < 0){
                        swal.showInputError("max_noise cannot be negative");
                        return false;
                    }
                    if(newMaxNoise > newMaxTotalNoise){
                        swal.showInputError("max_noise cannot be > max_total_noise");
                        return false;
                    }
                    if(newMaxTotalNoise < 0){
                        swal.showInputError("max_total_noise cannot be negative");
                        return false;
                    }
                    if(newMaxDuration < 0){
                        swal.showInputError("max_duration cannot be negative");
                        return false;
                    }
                    if(newMaxDuration > newMaxTotalDuration){
                        swal.showInputError("max_duration cannot be > max_total_duration");
                        return false;
                    }
                    if(newMaxTotalDuration < 0){
                        swal.showInputError("max_total_duration cannot be negative");
                        return false;
                    }

                    // max noise cannot be set together with default_transition
                    if(
                        parseInt(d3.select("[id^=input_max_noise_]").property("value")) > 0
                        && parseInt(d3.select("[id^=input_default_transition_target_]").property("selectedIndex")) > 0
                    ){
                        swal.showInputError("max_noise cannot be set with default_transition");
                        return false;
                    }

                    // check if name already exists
                    for(var state in context.getData.states){
                        if(context.getData.states.hasOwnProperty(state) && context.getData.states[state]){
                            if(newName === context.getData.states[state].name && context.getData.states[state].index !== d.index){
                                swal.showInputError("A state with this name already exists");
                                return false;
                            }
                        }
                    }

                    // aggregating new values in a single object
                    newValues = {
                        "newName":newName,
                        "newTerminal":newTerminal,
                        "newMaxNoise":newMaxNoise,
                        "newMaxTotalNoise":newMaxTotalNoise,
                        "newMaxDuration":newMaxDuration,
                        "newMaxTotalDuration":newMaxTotalDuration,
                        "newDefaultTransition":newDefaultTransition
                    };

                    edit_state(newValues,d,context);

                    cancel_selection(d);
                    edit_frontend_object(context.getData);
                    undo.addToStack(context.getData);
                    swal.close();   // close sweetalert prompt window
                }else if(inputValue === false){  // cancel
                    cancel_selection(d);
                    if(d.name === ""){  // if the state was being created
                        delete_state(d,context);
                        // edit fe object
                        edit_frontend_object(context.getData);
                        undo.addToStack(context.getData);
                    }
                    return false;
                }else if(inputValue === ""){
                    swal.showInputError("error");
                    return false;
                }
            });

            function displayStateAsList(d){
                var html = "",
                    currentState = context.getData.states[d.name],
                    input="",
                    propertiesToEdit=[
                        { "name":"name", "type":"text" },
                        { "name":"terminal", "type":"check" },
                        { "name":"max_noise", "type":"number" },
                        { "name":"max_total_noise", "type":"number" },
                        { "name":"max_duration", "type":"number" },
                        { "name":"max_total_duration", "type":"number" },
                        { "name":"default_transition", "type":"transition" }
                    ],
                    options = "",
                    hasSelection = false,
                    state,
                    isSilent = false;

                for(var i=0; i < propertiesToEdit.length; i++){
                    switch(propertiesToEdit[i].type){
                        case "text":
                            input = "<input "+
                                        "class='custom_swal_input' "+
                                        "type='text' "+
                                        "value='"+(currentState[propertiesToEdit[i].name] || "")+"' "+
                                        "id='input_"+propertiesToEdit[i].name+"_"+d.index+"' "+
                                    "/>";
                            break;
                        case "number":
                            input = "<input "+
                                        "class='custom_swal_input' "+
                                        "type='number' "+
                                        "value='"+(currentState[propertiesToEdit[i].name] || 0)+"' "+
                                        "id='input_"+propertiesToEdit[i].name+"_"+d.index+"' "+
                                    "/>";
                            break;
                        case "check":
                            input = "<input "+
                                        "class='custom_swal_input' "+
                                        "type='checkbox' "+
                                        (currentState[propertiesToEdit[i].name] ? "checked='true' " : "")+
                                        "id='input_"+propertiesToEdit[i].name+"_"+d.index+"' "+
                                    "/>";
                            break;
                        case "transition":
                            options = "";
                            hasSelection = false;

                            for(state in context.getData.states){
                                if(context.getData.states.hasOwnProperty(state) && context.getData.states[state] !== undefined){
                                    if(currentState[propertiesToEdit[i].name] !== undefined && currentState[propertiesToEdit[i].name].target == context.getData.states[state].name){
                                        hasSelection = context.getData.states[state].index;
                                    }
                                     options += "<option "+
                                                    (hasSelection === context.getData.states[state].index ? "selected='true'" : "")+
                                                    "value='"+context.getData.states[state].index+
                                                "'>"+
                                                    state+
                                                "</option>";
                                }
                             }

                             isSilent = false;
                             if(currentState[propertiesToEdit[i].name]){
                                 isSilent = currentState[propertiesToEdit[i].name].silent;
                             }else{
                                 isSilent = false;
                             }
                            input = "<span class='swal_select_container'>"+
                                        "<span class='swal_select_subcontainer'>"+
                                            "<select "+
                                                "class='custom_swal_select' "+
                                                "id='input_"+propertiesToEdit[i].name+"_target_"+d.index+"' "+
                                            ">"+
                                                "<option "+(hasSelection ? "" : "selected='true'")+" value=''>Select a target</option>"+
                                                options +
                                            "</select>"+
                                        "</span>"+
                                        "<span class='swal_select_subcontainer'>"+
                                            "<span class='sub_label'>silent : </span>"+
                                            "<input "+
                                                "class='custom_swal_input' "+
                                                "type='checkbox' "+
                                                (isSilent ? "checked='true' " : "")+
                                                "id='input_"+propertiesToEdit[i].name+"_silent_"+d.index+"' "+
                                            "/>"+
                                        "</span>"+
                                    "</span>";

                            break;
                        default:
                            input = "";
                            break;
                    }
                    html += "<span class='swal_display state_display state_display_"+d.index+"'>"+
                                "<label "+
                                    "class='custom_swal_label' "+
                                    "for='input_"+propertiesToEdit[i].name+"_"+d.index+"' "+
                                    "id='label_property_"+propertiesToEdit[i].name+"'"+
                                ">"
                                    +propertiesToEdit[i].name+" : "+
                                "</label>"+
                                input+
                            "</span>";
                }

                return html;
            }
        };
});
