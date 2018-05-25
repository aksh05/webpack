import { print } from './print.js';
import '../sass/style.scss';
require('./../../webpack/webfont.font.js');
// import Icon from './../i/infoedge-logo.png';

function component() {


    var element = document.createElement('div');
    var btn = document.createElement('button');
    var msg = new print();
    element.innerHTML = `Hello, webpack....123707</br>${msg.printMe()}</br></br>`;
    // element.innerHTML = 'Hello, webpack</br>'+msg.printMe()+'</br></br>';

    btn.innerHTML = '...Click me and check the consoles!ssdd';

    btn.onclick = () => {
        // btn.onclick = function(){
        btn.innerHTML = msg.printMe();

    };

    element.appendChild(btn);

    console.log(process.env.NODE_ENV)
    if (process.env.NODE_ENV !== 'production') {
        console.log('Looks like we are in development mode!');
    }

    // var myIcon = new Image();
    // myIcon.src = Icon;
    // element.appendChild(myIcon);

    return element;
}

document.body.appendChild(component());

if (module.hot) {
    module.hot.accept('./print.js', function() {
        console.log('Accepting the updated printMe module!');
        printMe();
        document.body.removeChild(element);
        element = component(); // Re-render the "component" to update the click handler
        document.body.appendChild(element);
    })
}