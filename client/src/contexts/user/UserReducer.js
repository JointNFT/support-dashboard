export const initialState = {
	user: null
}

export default function UserReducer(state, action) {
	switch(action.type) {
		case 'SET_USER':
			return {
				...state,
				user: action.user
			}
		default:
			return state;
	}
}