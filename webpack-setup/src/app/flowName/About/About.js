// Your first component...
let { Virtual } = window.interfaces;
import '../../../sass/css.scss';

class About extends Virtual.PureComponent {
    constructor() {
        super(...arguments);
    }
    
    render() {
        return <div className="about">
            <p>This is about component..87897.</p>
            <section>
            	<ul>
            		<li>Hello 1</li>
            		<li>Hello 2</li>
            		<li>Hello 3</li>
            	</ul>
            </section>
        </div>
    }


}

export default About;