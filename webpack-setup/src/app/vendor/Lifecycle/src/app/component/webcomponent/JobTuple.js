import { createStore } from "redux";

class JobTuple extends HTMLElement {
    static getName() {
        return "job-tuple";
    }
    render(props) {
        let isSavedItemClass = "bookmarkIcSel"; 

        if (props.isSaved) {
            this.ref.starIc[0].classList.add(isSavedItemClass);
        } else {
            this.ref.starIc[0].classList.remove(isSavedItemClass);
        }

    }
    initialRender(props) {
        return `<article> 
                    <a class="starIc fr bookmarkIc"></a>
                    <a> 
                            <span class="title">${props.title}</span> 
                            <span class="cName">${props.desc}</span> 
                            <b>${props.experience} Years</b>
                            <b>${props.location}</b>
                            <b class="ellipsis">${props.keySkills}</b>
                    </a>
                </article>`;
    }
    reducer(state, action) {
        switch (action.type) {
            case "TOGGLE_SAVE":
                return {...state, isSaved: !state.isSaved };
            default:
                return state;

        }
    }
    createdCallback() {
        let initialState = {
            desc: "Oracle",
            experience: "2-5",
            isSaved: true,
            keySkills: "c,java,pascal,lisp",
            location: "Bangalore",
            title: "Software Developer"
        }
        this.store = createStore(this.reducer, initialState);

        this.innerHTML = this.initialRender(initialState);
        this.store.subscribe(() => {
            this.render(this.store.getState());
        });
    }
    attachedCallback() {
        this.ref={
           starIc: $(this).find(".starIc")
        };
        this.ref.starIc.on("click", (event) => {
            this.store.dispatch({ type: "TOGGLE_SAVE" });
        });
    }
}
document.registerElement(JobTuple.getName(), JobTuple);
export default JobTuple;
