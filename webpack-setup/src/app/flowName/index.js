import FlowContainer from './FlowContainer.js';
import * as reducer from "./reducer.js";

export default { FlowContainer, reducer };
// let { Virtual ,page} = window.interfaces;

// class About extends Virtual.PureComponent {
//     constructor() {
//         super(...arguments);
//     }
    
//     onClick() {
//         page('/contact');
//     }

//     render() {
//         return <div>
//             <p>this is an about page</p>
//             <a href="javascript:;" onClick={::this.onClick}>Move to contact page</a>
//         </div>
//     }
// }

// class Contact extends Virtual.PureComponent {
//     constructor() {
//         super(...arguments);
//     }
    
//     onClick() {
//         page('/about');
//     }

//     render() {
//         return <div>
//             <p>this is an contact page</p>
//             <a href="javascript:;" onClick={::this.onClick}>Move to about page</a>
//         </div>
//     }
// }


// export { FlowContainer, reducer, About, Contact };