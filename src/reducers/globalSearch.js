
const initialState = {
    results: [],
    open: false
}

const globalSearch = (state = initialState, action) => {
    switch(action.type) {
        case 'RECEIVE_GLOBAL_RESULTS': {
            return {results: action.payload, open: true};
        }
        case 'TOGGLE_GLOBAL_RESULTS': {
            return {...state, open: !state.open};
        }
        case 'CLOSE_GLOBAL_RESULTS': {
            return {...state, open: false}
        }

        default: return state;
    }
}

export default globalSearch