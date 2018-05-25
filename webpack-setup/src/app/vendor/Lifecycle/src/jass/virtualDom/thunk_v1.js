import immutableThunk from "./immutable-thunk.js";

//Shallow comparator of args
const eqFn = (cargs, pargs) => {
    for (let key in cargs) {
        if (cargs[key] != pargs[key]) {
            return false;
        }
    }
    return true;


}


class GenericThunk extends immutableThunk {
    constructor(componentClass, fn, args) {
        let key;
        if(args){
            key = args.key || null;            
        }        
        super(fn, args, key, eqFn);
        this.componentClass = componentClass;
        if(args){
            this.transition = args.transition || null;
        }

    }
    render(previous) {
        if (previous) {
            this.component = previous.component;            
        }
        return super.render(previous);
    }

}

export default GenericThunk;
