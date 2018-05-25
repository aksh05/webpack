const path = require('path');
module.exports = {
    CircularLoader: path.resolve(__dirname, './loader/CircularLoader.js'),
    flowNameJS: path.resolve(__dirname, './../flowName/index.js'),
    // flowNameCSS: path.resolve(__dirname, './../flowName/flowcss.js'),
    aboutNameJS: path.resolve(__dirname, './../flowName/About/index.js'),
    // aboutNameCSS: path.resolve(__dirname, './../flowName/About/Aboutcss.js'),
    homeNameJS: path.resolve(__dirname, './../flowName/Home/index.js'),
    // homeNameCSS: path.resolve(__dirname, './../flowName/Home/Homecss.js'),
    trackingJS: path.resolve(__dirname, './../interfaces/tracking/index.js')
}