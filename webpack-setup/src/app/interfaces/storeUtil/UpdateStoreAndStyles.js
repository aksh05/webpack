let { Virtual} = window.interfaces;
/**
 * Inject styleString in <head>
 * @param  {[String]}
 * @return {[type]}
 */
/*export const injectAsyncStyles = (styleString) => {
    let styleNode = $(`<style>${styleString}</style>`);
    $("head").append(styleNode);
    return styleNode;
}*/


class UpdateStoreAndStyles extends Virtual.PureComponent {
    static propTypes = {
        reducer: Virtual.PropTypes.object,
        // styles: Virtual.PropTypes.string,
        children: Virtual.PropTypes.func.isRequired,
        injectAsyncReducer : Virtual.PropTypes.func.isRequired
    }
    constructor() {
        super(...arguments);
        this.styleNode = null;
        this.state = {
            isStoreReady: false
        };        
    }
    attachedCallback() {
        /*if (this.props.styles) {
            this.styleNode = injectAsyncStyles(this.props.styles);
        }*/
        if (this.props.reducer) {
            this.props.injectAsyncReducer(this.props.reducer, () => {
                this.setState({ isStoreReady: true })
            });
        }else{
            this.setState({ isStoreReady: true })
        }
    }
    attributeChangedCallback(nextProps){
        if(/*nextProps.styles!=this.props.styles || */nextProps.reducer!=this.props.reducer){
            this.setState({isStoreReady:false});
            /*if (nextProps.styles) {
                this.styleNode = injectAsyncStyles(nextProps.styles);
            }*/
            if (nextProps.reducer) {
                nextProps.injectAsyncReducer(nextProps.reducer, () => {
                    this.setState({ isStoreReady: true })
                });
            }else{
                this.setState({ isStoreReady: true })
            }       
        }
    }
    detachedCallback() {
        this.styleNode.remove();
    }
    render() {
        if (this.state.isStoreReady) {
            return Virtual.Children.only(this.props.children());
        }
        return null;
    }
}

export default (injectAsyncReducer)=>{
    return class extends Virtual.PureComponent{
        render(){
            return <UpdateStoreAndStyles injectAsyncReducer={injectAsyncReducer} {...this.props} />
        }
    }
}