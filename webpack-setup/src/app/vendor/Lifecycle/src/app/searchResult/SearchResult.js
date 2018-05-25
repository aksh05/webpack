let { Virtual, page } = window.interfaces;
import JobTuple from "../jobTuple/JobTuple.js";
import * as staticRoutes from "../searchFlow/routeStatic.js";

class SearchResult extends Virtual.Component {
    constructor(props) {
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
    attachedCallback() {
        document.getElementById("nextPage").onclick = () => {
            this.props.onLoadMore();
        }
        document.getElementById("modifyBtn").onclick = (event) => {
            page(staticRoutes.ROUTE_SEARCHFORM);
        }
    }
}
export default SearchResult;
