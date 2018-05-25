// Your first container...
let { connect } = window.interfaces;
import Route from './Route.js';

const mapStateToProps = (state) => {
    return {
        routeName: state.route.routeName
    };
};

/* const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    }
}*/

export default connect(mapStateToProps, null)(Route);
