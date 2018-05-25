let { Virtual, page } = window.interfaces;
import * as staticRoutes from "../searchFlow/routeStatic.js";

class SearchForm extends Virtual.Component {
    constructor() {
        super(...arguments);
        this.onChange = this.onChange.bind(this)
    }
    render() {
        let { keywords, location, onChangeData, onSubmitSearchForm } = this.props;
        //Search Form
        return <section className="pageC">
                    <form id="searchForm" ref="searchForm">
                        <label htmlFor="kwd" className="label">Keywords</label>
                        <div className="suggest" id="kwdsugg">
                            <div className="sWrap">
                                <div className="iconWrap">
                                    <a className="sCross"></a>
                                    <a className="nLoder" style={{"display": "none"}}></a>
                                </div>
                                <div className="inpWrap">
                                    <input value={keywords} onChange={this.onChange} name="keywords" type="search" id="Sug_kwdsugg" ref="keywords" maxLength="250" autoComplete="off" className="sugInp"  rel="custom:4001" placeholder="Enter Skills, Designation, Role" /> </div> <i className="erLbl" id="kwd_err"></i> </div>
                        </div>
                        <label htmlFor="location" className="label">Location</label>
                        <div className="suggest" id="locsugg">
                            <div className="sWrap">
                                <div className="iconWrap">
                                    <a className="sCross"></a>
                                    <a className="nLoder" style={{"display": "none"}}></a>
                                </div>
                                <div className="inpWrap">
                                    <input value={location} onChange={this.onChange} name="location" type="text" className="sugInp" ref="location" maxLength="250" autoComplete="off" id="Sug_locsugg" placeholder="Enter the cities you want to work in" rel="custom:4001,custom:4008" /> </div> <i className="erLbl" id="Sug_locsugg_err" value=""></i> </div>
                        </div>
                        <input id="sbt" type="submit" className="btn btnSpc" value="Search Jobs" />
                    </form>
                </section>;
    }
    onChange(event) {
        this.props.onChangeData(event.target.name, event.target.value);
    }
    createdCallback() {}
    attachedCallback() {
        $(this.refs.searchForm).on('submit', (event) => {
            event.preventDefault();
            this.props.onSubmitSearchForm();
            page(staticRoutes.ROUTE_SEARCHRESULT);
        });
    }
}

export default SearchForm;
