import {
    ROUTE_CHANGE,
    FETCH_COMPLETE,
    FETCH_REQUEST,
    FETCH_SUCCESS,
    FETCH_FAILURE,
    REQUEST_ABORT_ALL,
    REQUEST_ADD,
    REQUEST_REMOVE
} from "../actionTypes/actionTypes.js";

export default (state = {
    list: [],
    isCommonLoaderVisible: false,
    linearLoaderVisibility: false
}, action) => {
    switch (action.type) {
        case "REHYDRATE":
        case FETCH_SUCCESS:
        case FETCH_FAILURE:
            return {...state,
                isCommonLoaderVisible: false,
                linearLoaderVisibility: false
            }
        case FETCH_REQUEST:
            if (action.payload) {
                if (action.payload.type === "block") {
                    return {...state, isCommonLoaderVisible: true };
                    //return {...state, isCommonLoaderVisible: false };
                } else if (action.payload.type === "liner") {
                    return {...state, linearLoaderVisibility: true };
                }
            }
            return state;
        case ROUTE_CHANGE:
            state.list.forEach((request) => { request.abort(); })
            return {...state,
                list: []
            }
        case REQUEST_ADD:
            {

                let loader = {};
                if (action.payload.method !== "GET") {
                    loader['isCommonLoaderVisible'] = true;
                    //loader['isCommonLoaderVisible'] = false;
                } else {
                    loader['linearLoaderVisibility'] = true;
                }

                return {...state,
                    list: state.list.concat(action.payload.request),
                    ...loader
                };
            }
        case REQUEST_REMOVE:
            {
                let list = state.list.filter(request => request != action.payload.request);
                let loader = {};
                if (action.payload.method !== "GET") {
                    loader['isCommonLoaderVisible'] = false;
                } else {
                    loader['isCommonLoaderVisible'] = false;
                    loader['linearLoaderVisibility'] = false;
                }
                return {
                    ...state,
                    list,
                    // isCommonLoaderVisible: list.length ? true : false,
                    ...loader
                };
            }
        default:
            return state;

    }

}
