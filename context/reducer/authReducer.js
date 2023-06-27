
const authReducer = (state, action) => {
    switch (action.type) {
        case "LOAD_TRUE":
            return {
                ...state,
                isLoading: true
            }
        case "LOAD_FALSE":

            return {
                ...state,
                isLoading: false,
                currentUser: null
            }
        case "LOAD_FALSE_AND_ADD_USER":

            return {
                ...state,
                isLoading: false,
                currentUser: action.payload.user
            }
        case "UPDATEDOC":
            return {
                ...state,
                currentUser: { ...state.currentUser, ...action.payload.obj }
            }
        default:
            return state
    }
}

export default authReducer
