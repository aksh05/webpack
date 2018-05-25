// Your first component...
let { Virtual } = window.interfaces;
import '../../../sass/Home.scss';

class Home extends Virtual.PureComponent {
    constructor() {
        super(...arguments);
    }
    
    render() {
        return <div>
            <p>This is Home component</p>
        </div>
    }


}

export default Home;