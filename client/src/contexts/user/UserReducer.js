export const initialState = {
    user: null,
    channels: [],
    socket: null,
    channel: null,
    accessToken: "",
    loading: true,
    connectedCount: 0,
    accessToken: "",
    organization: null
};

export const localState = JSON.parse(localStorage.getItem("state"));

console.log('state', localState);

export default function UserReducer(state, action) {
    if (action === null) {
		localStorage.removeItem("state");
        return initialState;
    }

    switch (action.type) {
        case "SET_USER":
            return {
                ...state,
                user: action.user,
            };
        case "SET_ACCESS_TOKEN":
            return {
                ...state,
                accessToken: action.accessToken,
            };
            case "SET_ORGANIZATION":
                return {
                    ...state,
                    organization: action.organization,
                };
        default:
            return state;
    }
}
