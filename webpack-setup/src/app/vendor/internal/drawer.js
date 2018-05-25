/**
    Author : Ankit Anand
    Desc : Integrate modal with routes
           Following code does not support overlapping modals, 
           To prevent this feature provide routing:false
*/

import "./../../../../../../naukri-ui-dev/modelWindow/src/j/plugins-zepto/drawer-zepto_v3.js"; //$.fn.drawer
import * as routeGen from "../../root/routeGenerator.js";
let { page } = window.interfaces;
let originalDrawer = $.fn.drawer;
let stack = [];
let closePromiseResolve = null;
let closePromise = new Promise((resolve, reject) => { closePromiseResolve = resolve });

//On exiting route having action=drawerOpen
page.exit("*", (ctx, next) => {
    if (ctx.querystring.match(/[&?]*action=drawerOpen/)) {
        if (stack.length) {
            stack.shift().close();
        }
        closePromiseResolve();
    } else {
        next();
    }
});
page("*", (ctx, next) => {
    if (ctx.querystring.match(/[&?]*action=drawerOpen/)) {
        //Do something on route change        
    } else {
        next();
    }
});

//Make sure to close drawer manually before openning new
const onOpen = (instance) => {
    page(routeGen.drawerAction());
    stack.unshift(instance);
}


$.fn.drawer = function(options) {

    //If routing is false return original drawer
    if (options.routing === false) {
        return originalDrawer.call(this, options);
    } else {

        let orignalInstance = (originalDrawer.call(this, {...options,
            open: {...options.open,
                success: function() {
                    if (options.open && options.open.success) {
                        options.open.success.call(this, ...arguments);
                    }
                    onOpen(this);
                }
            },
            close: {...options.close,
                success: (close_target) => {
                    //If closed through nodes, layer or esc
                    if (close_target) {                        
                        closePromise = new Promise((resolve, reject) => {
                            closePromiseResolve = resolve;
                            stack.shift();
                            history.back();
                        });
                        closePromise.then((successMessage) => {
                            if (options.close && options.close.success) {
                                options.close.success.call(this, close_target);
                            }
                        });
                    } else {
                        if (options.close && options.close.success) {
                            options.close.success.call(this, close_target);
                        }
                    }


                }
            }
        }));
        return {...orignalInstance,
            close: () => {
                history.back();
            },
            destroy: function() {
                //In case drawer is destroyed directly, without route change we check length of stack and call histroy.back
                if (stack.length) {
                    history.back();
                }
                orignalInstance.destroy();
                orignalInstance = null;
            }
        };
    }
};
