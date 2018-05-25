## How to start:
    npm run dev      //  for development build
    npm run prod    //  for production build
    npm run Start   //  to start a dev server
    npm run watch   // watch mode
    

## Build size Grunt v/s Webpack

Name  | Grunt(KB)	|Webpack(KB) 
----|-----|----- 
external.js 	|329						|317+22=339(vendor+external)
app.js 			|14.4						|18.7
require			|17.2 						|0 (no require)
runtime			|0 							|1.74
text            |4.44                       | 0 
flowName        |1.83 						|2.05
tracking		|4.69 						|4.97
Toal size in Kbs			|413.86 					|376.46




### Development Speed: (Superfast 1~3 Sec)
    Provide live development server so that all the changes quickly reflected ( 1~3 sec) in the browser. So those days have gone when you have to run build for a single change(took approx 1~3 minute(s))

## Migration Benefits
    * Only used files will be processed:
         - The only bundled file will be transpiled(by babel).
         - The loader will be run only on bundled file.
         - Only bundled images will be optimized.
    
    * Reduced overall bundle file size:

### Other benifits
    
* Hash versioning support

* No duplication of modules

* Having all the existing grunt build features

* Dynamic Lazyloading


### Future development areas:
    Babel compilation based on browser support
    CSS module namespaces.
    reduce CSS nesting by hashing