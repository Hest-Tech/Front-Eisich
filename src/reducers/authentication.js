/**
 * Authentication Reducer
 */

import clientStorage from '../utils/clientStorage';


const fetchUser = new clientStorage();
const userCookie = fetchUser.getCookie('user');
const parsedCookie = userCookie && JSON.parse(userCookie);
const autheticationReducerDefaultState = {
    isAuthenticated: userCookie ? true : false,
    user: userCookie ? parsedCookie : null,
    displayName: userCookie ? parsedCookie.firstName : null,
    openAuthPopUp: false,
    closeAuthPopUp: undefined,
    registering: false,
    loggingIn: false,
    updateAddress: false,
    resetingPass: false
}

export default (state = autheticationReducerDefaultState, action) => {
    switch (action.type) {
        case 'LOAD_USER':
            return {
                ...state,
                isAuthenticated: true,
                displayName: action.displayName,
                user: action.user
            };
        case 'OPEN_AUTH_POPUP':
            return {
                ...state,
                openAuthPopUp: true,
                closeAuthPopUp: false,
                loggingIn: true
            }
        case 'LOGIN_FORM':
            return {
                ...state,
                loggingIn: true,
                registering: false,
                resetingPass: false
            }
        case 'SIGNUP_FORM':
            return {
                ...state,
                registering: true,
                loggingIn: false,
                resetingPass: false
            }
        case 'POP_ADDRESS_BOOK_FORM':
            return {
                ...state,
                updateAddress: !state.updateAddress,
            }
        case 'RESET_PASS_FORM':
            return {
                ...state,
                registering: false,
                loggingIn: false,
                resetingPass: true
            }
        case 'UNLOAD_USER':
            return {
                isAuthenticated: false,
                user: {},
                openAuthPopUp: false,
                closeAuthPopUp: undefined,
                registering: false,
                loggingIn: false,
                displayName: null,
                updateAddress: false,
                resetingPass: false
            }
        case 'CLOSE_AUTH_POPUP':
            return {
                ...state,
                closeAuthPopUp: true,
                registering: false,
                loggingIn: false,
                resetingPass: false,
                isAuthenticated: false,
                updateAddress: false,
                openAuthPopUp: false
            }
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
                displayName: action.displayName,
                user: action.user
            };
        case 'REGISTER_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
                user: action.user,
                displayName: action.displayName
            };
        case 'LOGOUT_SUCCESS':
            return {
                ...state,
                user: {},
                isAuthenticated: false,
                displayName: null
            };
        case 'SET_DEFAULT_ADDRESS':
            return {
                ...state,
                user: {
                    ...state.user,
                    address: { ...action.payload }
                },
                isAuthenticated: true,
                // displayName: action.payload.firstName
            }
        case 'UPDATE_USER_PROFILE':
            return {
                ...state,
                user: {
                    ...state.user,
                    ...action.updates
                },
                isAuthenticated: true,
                displayName: action.updates.firstName
            }
        case 'RESET_PASSWORD':
        case 'UPDATE_ADDRESS_BOOK':
        default:
            return state;
    }
}