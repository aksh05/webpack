// Your first container...
let { connect } = window.interfaces;
import Home from './Home.js';

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

export default connect(mapStateToProps, null)(Home);
