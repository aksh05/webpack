import LazilyLoad from "./LazilyLoad.js";
let {Virtual,VirtualCSSTransitionGroup} = window.interfaces;

export default class extends LazilyLoad{
    static propTypes = {
        children: Virtual.PropTypes.func.isRequired,
        modules: Virtual.PropTypes.object.isRequired,
        loader:Virtual.PropTypes.node.isRequired,
        style:Virtual.PropTypes.object,
        transition:Virtual.PropTypes.bool,
        className:Virtual.PropTypes.string,
        transitionKey:Virtual.PropTypes.string,
        transitionName:Virtual.PropTypes.string,
        transitionEnterTimeout:Virtual.PropTypes.number,
        transitionLeaveTimeout:Virtual.PropTypes.number,

    };
    static defaultProps={
        loader:null,
        transition:true,
        style:null,
        className:"",
        transitionKey:"",
        transitionName:"fade",
        transitionEnterTimeout:500,
        transitionLeaveTimeout:300,
    };
    render() {
        // debugger
		let view;
        if (!this.state.isLoaded){ 
            view = this.props.loader;
        }else{
            let isChild = this.props.children(this.state.modules);
            view = <div key={this.props.transitionKey}>
                    {isChild && Virtual.Children.only(isChild)}
                </div>;	
        }

        if(this.props.transition){
            return <VirtualCSSTransitionGroup style={this.props.style} className={`lazilyLoad ${this.props.className}`} transitionName={this.props.transitionName} transitionEnterTimeout={this.props.transitionEnterTimeout} transitionLeaveTimeout={this.props.transitionLeaveTimeout}>
                    {view}  
                </VirtualCSSTransitionGroup>;    
        }
        return <span className={`lazilyLoad ${this.props.className}`}>{view}</span>;        
    }
}

