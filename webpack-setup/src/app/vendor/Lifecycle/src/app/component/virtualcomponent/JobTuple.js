import Virtual from "../../../jass/react/Virtual.js";



class JobTuple extends Virtual.Component {
    constructor() {
        super(...arguments);
    }
    get initialState() {
        return {
            isSaved: false
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return (this.props.tuple != nextProps.tuple) || (this.state != nextState);
    }
    reducer(state = {}, action) {
        switch (action.type) {
            case 'TUPLE_SAVE':
                return {...state, "isSaved": !state.isSaved };
            default:
                return state;
        }
    }
    toggleSave() {
        this.store.dispatch({ type: "TUPLE_SAVE" });
    }
    render() {
        var isJobSaved = this.state.isSaved ? "starIc fr bookmarkIcSel" : "starIc fr bookmarkIc";

        return <article>
                    <a ref="starIc" className={isJobSaved} onClick={this.toggleSave.bind(this)}></a>
                    <a> 
                            <span className="title">{this.props.tuple.title}</span> 
                            <span className="cName">{this.props.tuple.desc}</span> 
                            <b>{this.props.tuple.experience} Years</b>
                            <b>{this.props.tuple.location}</b>
                            <b className="ellipsis">{this.props.tuple.keySkills}</b>
                    </a>
                </article>;
    }
    createdCallback() {}
    attachedCallback() {}
}

export default JobTuple;
