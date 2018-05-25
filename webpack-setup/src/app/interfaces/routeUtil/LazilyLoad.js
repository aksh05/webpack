let { Virtual } = window.interfaces;
class LazilyLoad extends Virtual.PureComponent {
    static propTypes = {
        children: Virtual.PropTypes.func.isRequired,
        modules: Virtual.PropTypes.object.isRequired,
    };
    constructor() {
        super(...arguments);
        this.state = {
            isLoaded: false,
            modules: null
        };
    }
    componentDidMount() {
        this._isMounted = true;
        this.load();
    }

    componentDidUpdate(previous) {
        const shouldLoad = !!Object.keys(this.props.modules).filter((key) => {
            return this.props.modules[key] !== previous.modules[key];
        }).length;
        if (shouldLoad) {
            this.load();
        }
    }

    componentWillUnmount() {

        this._isMounted = false;
    }

    load() {
        this.setState({
            isLoaded: false,
        });

        const { modules } = this.props;
        const keys = Object.keys(modules);
        Promise.all(keys.map((key) => modules[key]()))
            .then((values) => (keys.reduce((agg, key, index) => {
                agg[key] = values[index];
                return agg;
            }, {})))
            .then((result) => {
                if (!this._isMounted) return null;
                this.setState({ modules: result, isLoaded: true });
            });
    }

    render() {
        debugger
        if (!this.state.isLoaded) return null;
        return Virtual.Children.only(this.props.children(this.state.modules));
    }
}

LazilyLoad.propTypes = {
    children: Virtual.PropTypes.func.isRequired,
};
/*
export const LazilyLoadFactory = (Component, modules) => {
    return (props) => (
        <LazilyLoad modules={modules}>
      {(mods) => <Component {...mods} {...props} />}
    </LazilyLoad>
    );
};

export const importLazy = (promise) => (
    promise.then((result) => result.default)
);*/

export default LazilyLoad;
