// Your first container...
let { connect } = window.interfaces;
import About from './About.js';

const mapStateToProps = (state, ownProps) => {
    return {
        route: state.route
    }
}
/*
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
          
    }
}*/

export default connect(mapStateToProps, null)(About);
