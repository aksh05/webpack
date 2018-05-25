Currently we support two types of components

* Web components
* Virtual components


Thunk

Members

Class tagName
tagName component
Function renderFn
Object props
String type
VNode vnode

Methods
VNode render()

VirtualComponent

Members
Object props
Object state	
Thunk thunk
Node node
Should be accessed only in lifecycle callbacks
Object store
Created only if this.state is not null.


Methods

Api
dispatch
this.store.dispatch (Internal)
this.props.store.dispatch (External)
Store createStore()
void unsubscribe()
void setState(newState)
Specification
render 
shouldComponentUpdate
getInitialState
String getName()
Object reducer(state,action)
Lifecycle
void createdCallback()
void attachedCallback()
void detachedCallback()



Other types
VNode

To do
Like react-id, test keys
Check why not attributes are rendering fine

web component 
Virtual component 
Do not have any state to change after initial render
Do have data called props and state, which can change after initial render
Prefill using ES6 interpolation
Prefill using VDOM bindings
Children are:
Other stateless component
Other stateful components that renders once

Children are:
Other stateless component
Other stateful component



FAQ

How we transfer props in web and virtual components?

* In web component we transfer props using data-attributes
* In virtual component we transfer props using property "props" using JSX.

How we use web and virtual components?

Web component 
<todo-list><todo-list>

Web component 
<TodoList><TodoList> //class name

Can we use life cycle callbacks of web component for virtual component?

No

Virtual components are not extended from HTML Element.

But you can define same life cycle methods as in web components.

But if you are doing reflow and repaint you need to wrap it within fastdom




#### Web components

It is a web standard to:
* Register element with DOM
* Define lifecycle callbacks on custom element
    * createdCallback
    * attachedCallback
    * attributeChangedCallback
    * detachedCallback
#### Example
<a href="http://dev1.fed.infoedge.com/ankit.anand/Lifecycle/src/app/component/webcomponent/">JobTuples web component</a>
```javascript
class JobTuple extends HTMLElement {
    static getName() {
        return "job-tuple";
    }
    static render({ state }) {
        return `<article> 
                    <a class="starIc fr bookmarkIcSel"></a>
                    <a> 
                            <span class="title">${state.title}</span> 
                            <span class="cName">${state.desc}</span> 
                            <b>${state.experience} Years</b>
                            <b>${state.location}</b>
                            <b class="ellipsis">${state.keySkills}</b>
                    </a>
                </article>`;
    }
    createdCallback() {
        
        this.state = {
            desc: "Oracle",
            experience: "2-5",
            isSaved: true,
            keySkills: "c,java,pascal,lisp",
            location: "Bangalore",
            title: "Software Developer"
        };

        this.innerHTML = JobTuple.render(this);
    }
    attachedCallback() {

        $(this).find(".starIc").on("click",(event)=>{
            this.state.isSaved = !this.state.isSaved;
            $(event.target).attr("class", (this.state.isSaved ? "starIc fr bookmarkIcSel" : "starIc fr bookmarkIc"));
        });
    }
}
document.registerElement(JobTuple.getName(), JobTuple);
export default JobTuple;
```

#### Virtual Components

Virtual components are web components, with some exceptions:
* In place of innerHTML we use Virtual DOM API to appendChild.
* In place of HTML string we write JSX.

#### Example
<a href="http://dev1.fed.infoedge.com/ankit.anand/Lifecycle/src/app/component/virtualcomponent/">JobTuples virtual component</a>
```javascript
class JobTuple extends VirtualComponent {
    getName() {
        return "job-tuple";
    }
    shouldComponentUpdate(nextProps, nextState) {
        return (this.props.tuple != nextProps.tuple) || (this.state != nextState);
    }
    getInitialState() {
        return {
            isSaved: false
        }
    }
    reducer(state = {}, action) {
        switch (action.type) {
            case 'TUPLE_SAVE':
                return {...state, "isSaved": !state.isSaved };
            default:
                return state;
        }
    }
    toggleSelect() {
        this.props.store.dispatch({ type: "TUPLE_SELECT", index: this.props.index });
    }
    toggleSave() {
        //this.setState({ isSaved: !this.state.isSaved });
        this.store.dispatch({ type: "TUPLE_SAVE" });
    }
    render() {
        var isJobSaved = this.state.isSaved ? "starIc fr bookmarkIcSel" : "starIc fr bookmarkIc";


        return <article>
                    <input type="checkbox" checked={this.props.isSelected}  />
                    <a className={isJobSaved}></a>
                    <a> 
                            <span className="title">{this.props.tuple.title}</span> 
                            <span className="cName">{this.props.tuple.desc}</span> 
                            <b>{this.props.tuple.experience} Years</b>
                            <b>{this.props.tuple.location}</b>
                            <b className="ellipsis">{this.props.tuple.keySkills}</b>
                    </a>
                </article>;
    }
    createdCallback() {}
    attachedCallback() {
        $(this.node).find(".starIc").on("click", (event) => {
            this.toggleSave();
        });
        $(this.node).find("[type=checkbox]").on("change", (event) => {
            this.toggleSelect();
        });
    }
}

export default JobTuple;
```


