import Virtual from "../../../../jass/react/Virtual.js";
import JobTuple from "./JobTuple.js";
import page from "page";


class SearchResult extends Virtual.Component {
    constructor(props){
        //props = {...props, ...bindActionCreators(actionCreator, props.store.dispatch) };
        super(props);
        
    }
    render() {
        let { state, keywords, onSaveJob } = this.props;
        //Map tuples to HTML
        let tuplesTemplate = state.tuples.map(function(tuple, index) {
            let state = tuple;
            return <JobTuple key={index} state={tuple} index={index} onSaveJob={onSaveJob} ></JobTuple>            
        });

        //SRP head and Tuple container
        return <div>
                    <section className="srchHead"> 
                        <a href="javascript:void(0);" id="modifyBtn" className="btn inlineBtn fr greyBtn">Modify</a> 
                        <span id="showTxt">
                            <h1>{keywords}</h1>
                        </span>
                        <div className="cl"></div>
                    </section>
                    <section id="srchTpls" className="listMenu linkList">
                        {tuplesTemplate}                        
                        <a id="nextPage" key="nextPage" href="javascript:void(0);" className="loadC oh loadFull"><em className="loadIc"></em>Load More Jobs</a>
                    </section>                      
                </div>

    }
    createdCallback(){
        
    }
    attachedCallback() {
        document.getElementById("nextPage").onclick = () => {
            this.props.onLoadMore();
        }
        document.getElementById("modifyBtn").onclick = (event) => {
            page("/searchForm");
        }
    }
}
export default SearchResult;
