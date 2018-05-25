let { Virtual } = window.interfaces;

class JobTuple extends Virtual.Component {
    shouldComponentUpdate(nextProps) {
        return this.props.state != nextProps.state;
    }
    render() {
        let { state, onSaveJob, index } = this.props;
        //Map tuples to HTML
        var savedStatusClassName = state.isSaved ? "starIc fr bookmarkIcSel" : "starIc fr bookmarkIc";
        let onClickSaveJob = (event) => {
            onSaveJob(index);
        };

        return <article> 
		        	<span className="appHistIcPos"></span>
		            <a className={savedStatusClassName} href="javascript:void(0);" onClick={onClickSaveJob}></a>
		            <a href="javascript:void(0);"> 
		            		<em className="nflIc"></em> 
		            		<span className="title">
		            			{state.title}
		            		</span> 
		            		<span className="cName">{state.desc}</span> 
		            		<span>
			            		<em className="expIc fl"></em>
			            		<b>{state.experience} Years</b>
		            		</span> 
		            		<span>
		            			<em className="locIc fl"></em>
		            			<b>{state.location}</b>
		            		</span> 
		            		<span>
		            			<em className="ksIc fl"></em>
		            			<b className="ellipsis">{state.keySkills}</b>
		            		</span> 
		            </a>
		        </article>

    }
}

export default JobTuple;
