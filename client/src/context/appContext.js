import React, { useReducer, useContext } from 'react';
import { CLEAR_ALERT, DISPLAY_ALERT, REGISTER_USER_BEGIN, REGISTER_USER_SUCCESS, REGISTER_USER_ERROR, LOGIN_USER_BEGIN, LOGIN_USER_ERROR, LOGIN_USER_SUCCESS,SETUP_USER_BEGIN,SETUP_USER_ERROR,SETUP_USER_SUCCESS, TOGGLE_SIDEBAR, LOGOUT_USER} from './actions';
import reducer from './reducer';
import axios from 'axios';


const token = localStorage.getItem('token')
const user = localStorage.getItem('user')
const userLocation = localStorage.getItem('location')


export const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  user: user? JSON.parse(user) : null,
  token: token,
  userLocation: userLocation || '',
  jobLocation: userLocation || '',
  showSidebar: false,
};
const AppContext = React.createContext();
const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

const displayAlert = () => {
  dispatch({type:DISPLAY_ALERT})
  clearAlert()
}

const clearAlert = () => {
  setTimeout(() => {
    dispatch({
      type: CLEAR_ALERT,
    });
  }, 3000);
}

const addUserToLocalStorage = ({user, token, location}) => {
  localStorage.setItem('user',JSON.stringify(user))
  localStorage.setItem('token',JSON.stringify(token))
  localStorage.setItem('location',JSON.stringify(location))
}

const removeUserFromLocalStorage = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('location')
  localStorage.removeItem('token')
}

const registerUser = async (currentUser) =>{
  dispatch({ type: REGISTER_USER_BEGIN })
  try{
    const response = await axios.post('/api/v1/auth/register', currentUser)
    // console.log(response);
    const {user, token, location} = response.data
    dispatch({
      type:REGISTER_USER_SUCCESS, 
      payload:{user,token,location},
    })
    //local storage
    addUserToLocalStorage({user,location,token})
  } catch(error){
    // console.log(error.response);
    dispatch({type: REGISTER_USER_ERROR, 
      payload:{msg:error.response.data.msg}})
  }
  clearAlert();
}


const loginUser = async (currentUser) => {
  dispatch({ type: LOGIN_USER_BEGIN })
  try{
    const {data} = await axios.post('/api/v1/auth/login', currentUser)
    // console.log(response);
    const {user, token, location} = data
    dispatch({
      type: LOGIN_USER_SUCCESS, 
      payload:{user,token,location},
    })
    //local storage
    addUserToLocalStorage({user,location,token})
  } catch(error){
    // console.log(error.response);
    dispatch({type: LOGIN_USER_ERROR, 
      payload:{msg:error.response.data.msg}})
  }
  clearAlert();
}

const setupUser = async ({currentUser,endPoint,alertText}) => {
  dispatch({ type: SETUP_USER_BEGIN })
  try{
    const {data} = await axios.post(`/api/v1/auth/${endPoint}`, currentUser)
    // console.log(response);
    const {user, token, location} = data
    dispatch({
      type: SETUP_USER_SUCCESS, 
      payload:{user,token,location, alertText},
    })
    //local storage
    addUserToLocalStorage({user,location,token})
  } catch(error){
    // console.log(error.response);
    dispatch({type: SETUP_USER_ERROR, 
      payload:{msg:error.response.data.msg}})
  }
  clearAlert();
}
const toggleSidebar = () => {
  dispatch({type: TOGGLE_SIDEBAR})
}
const logoutUser = () => {
  dispatch({type: LOGOUT_USER})
  removeUserFromLocalStorage()
}

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        registerUser,
        loginUser,
        setupUser,
        toggleSidebar,
        logoutUser,
      }}
      >
        {children}
      </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext)
};

export { AppProvider };