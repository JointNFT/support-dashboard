import UserContext from "./UserContext";
import {useReducer} from 'react';
import UserReducer, {initialState} from "./UserReducer";
import { Auth, Hub } from 'aws-amplify';

const UserState = (props) => {
	const [state, dispatch] = useReducer(UserReducer, initialState);

	const loginUser = async (user) => {
		console.log(user);
		// dispatch({
		// 	type: "LOGIN_USER",
		// 	loggedInUser: address,
		// 	keyCID: cid,
		// 	keys: keys,
		// 	credits: credits,
		// 	allCIDs: { ...allCIDs }			
		// });
	};

	
	return (
		<UserContext.Provider
			value={{
				loginUser: state.loginUser,
			}}
		>
			{props.children}
		</UserContext.Provider>
	);
};


export default UserState;
