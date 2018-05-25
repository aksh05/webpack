import getTuples from "./getTuples.js";
let action = {
    onSaveJob: function(id) {
       return {
            type : "SAVE_TUPLE",
            id
       }       
    },
    onLoadMore : function(){
    	return function(dispatch){
            return getTuples().then(function(data) {
                dispatch({
                    type: "ADD_TUPLES",
                    tuples: data.tuples
                });                 
            });    
        }        
    }    
}

export default action;
