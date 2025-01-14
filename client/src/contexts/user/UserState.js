import UserContext from "./UserContext";
import { useReducer, useEffect } from "react";
import UserReducer, { initialState, localState } from "./UserReducer";
import { Auth, Hub } from "aws-amplify";

const UserState = (props) => {
    const [state, dispatch] = useReducer(UserReducer, localState || initialState);

    useEffect(() => {
		console.log('here')
        localStorage.setItem("state", JSON.stringify(state));
    }, [state]);

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

    const setAccessToken = async (accessToken) => {
        console.log("accessToken is being set", accessToken);
        dispatch({
            type: "SET_ACCESS_TOKEN",
            accessToken: accessToken,
        });
    };

    return (
        <UserContext.Provider
            value={{
                loginUser: state.loginUser,
                setAccessToken: setAccessToken,
                accessToken: state.accessToken,
            }}
        >
            {props.children}
        </UserContext.Provider>
    );
};

export default UserState;
