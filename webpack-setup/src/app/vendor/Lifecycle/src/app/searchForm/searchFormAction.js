import getTuples from "../jobTuple/getTuples.js";

let action = {
    onSubmitSearchForm: function(form) {        
        return function(dispatch){
            return getTuples().then(function(data) {
                dispatch({
                    type: "REPLACE_TUPLES",
                    tuples: data.tuples
                });                 
            });    
        }        
    },
    onChangeData: function(name, value) {
        return {
            type: "CHANGE_DATA",
            data: { name, value }
        }
    }
}

export default action;
