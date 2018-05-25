import Virtual from "../../../jass/react/Virtual.js";
import * as Redux from "redux";
import JobTuple from "./JobTuple.js";

let transition = {
    duration: 400,
    enterClass: 'enter',
    leaveClass: 'leave'
};

class TupleList extends Virtual.Component {
    get initialState() {
        return {
            tuples: [{
                desc: "Oracle",
                experience: "2-5",
                isSelected: false,
                keySkills: "c,java,pascal,lisp",
                location: "Bangalore",
                title: "Software Developer"
            }, {
                desc: "Oracle",
                experience: "2-5",
                isSelected: false,
                keySkills: "c,java,pascal,lisp",
                location: "Bangalore",
                title: "Software Developer"
            }]
        }
    }
    render() {
        let tuples = this.state.tuples.map((tuple, index) => {
            return <JobTuple key={index} tuple={tuple} store={this.store} index={index} transition={transition}  />
        });

        return <div>
                    <section id="srchTpls" className="listMenu linkList">
                        {tuples}     
                        <a id="nextPage" ref="nextPage" key="nextPage" href="javascript:void(0);" className="loadC oh loadFull" onClick={this.onLoadMore.bind(this)}><em className="loadIc"></em>Load More Jobs</a>                   
                    </section>
                </div>
    }
    reducer(state = [], action) {
        switch (action.type) {
            case 'ADD_TUPLES':
                return {...state, tuples: state.tuples.concat(action.tuples) };
            default:
                return state;
        }
    }
    onLoadMore() {
        this.store.dispatch({
            type: "ADD_TUPLES",
            tuples: this.initialState.tuples
        });
    }
    
}


export default TupleList;
