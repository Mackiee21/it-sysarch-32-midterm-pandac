import { createContext, ReactNode, useContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "../axios/axiosPrivate";


/* #### READ
  KARON RAKO KA REALIZE NA DLEE D AY MO RE-EXECUTE ANG MGA CODES LIKE GET STORGAGE EVEN IF NI RE-RENDER HAHAAAHAAHHAHA
*/

export enum ActionType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT'
}

type ContextProps = {
  state: UserProps
  login: (payload: UserProps) => void
  logout: () => void
};

type MainProps = {
  children: ReactNode
};

type ActionProps = {
  type: ActionType.LOGIN | ActionType.LOGOUT
  payload?: UserProps
};

type UserProps = {
  _id: string | null
  name: string | null
  email: string | null
  token: string | null
  image: string | null
};

const defaultContext: ContextProps = {
  state: {_id: null, name: null,  email: null, token: null, image: null},
  login: () => {},
  logout: () => {}

}

const AppContext = createContext<ContextProps>(defaultContext);

const userReducer = (state: UserProps, action: ActionProps): UserProps => {
  switch (action.type) {
    case ActionType.LOGIN:
      console.log("STATE", state)
      console.log("PAYLOAD", action.payload)
      localStorage.setItem('user', JSON.stringify({...action.payload}))
      localStorage.setItem('token', action.payload?.token as string)
      return {
        ...state,
        ...action.payload
      }
    
    case ActionType.LOGOUT:
      // Perform logout mechanism here
      localStorage.clear()
      return {
        ...state,
        email: null,
        _id: null,
        token: null, //reset the token
      }

    default: return state
  }
};


export const Provider = ({ children }: MainProps) => {
  //INTERCEPT EVERY RESPONSE, CURRENTLY NO USE
  axiosPrivate.interceptors.response.use(response => response,
    error => {
      console.log("RESPONSE ERROR", error)
      return Promise.reject(error)
    }
    )
  const navigate = useNavigate()
  const get_user = localStorage.getItem("user") 
  const currentUser = get_user ? JSON.parse(get_user) : null

  const [state, dispatch] = useReducer(userReducer, { _id: currentUser?._id, name: currentUser?.name,  email: currentUser?.email, image: null,  token: localStorage.getItem("token")})
  
  const login = (payload: UserProps) => {
    dispatch({ type: ActionType.LOGIN, payload });
  };

  const logout = () => {
    dispatch({type: ActionType.LOGOUT})
  }
  
  //ORDER MATTERS
  //THIS WILL ONLY TRIGGER IF state.token is updated and no authorization header
  //WHAT THIS DOES, IS BASICALLY ADD THE TOKEN THE USER SO IT WILL BE VERIFIED EVERYTIME MO MAKE SIYAG REQUEST
  useEffect(() => {
    const privateVilla = axiosPrivate.interceptors.request.use(config => {
      if (!config.headers["Authorization"]) {
        config.headers["Authorization"] = `Bearer ${state.token}`;
      }
      // console.log('CONFIG', config)
      return config;
    }, (error) => Promise.reject(error));

    return () => {
      axiosPrivate.interceptors.request.eject(privateVilla)
    }
  }, [state.token])


  useEffect(() => {
    const validateUser = async () => {
      try {
        if(localStorage.getItem("user")){
          console.log("STATE USER", state._id)
          const response = await axiosPrivate.post("/api/validate-user", {_id: state._id})
          console.log("REPONSE FROM VALIDATE", response.data)
          if(localStorage.getItem("token")) {
            const user_merged = {...response.data.user, token: localStorage.getItem("token")}
           dispatch({type: ActionType.LOGIN, payload: user_merged})
          }
        }
      } catch (error: any) {
        localStorage.clear()
        logout() //just in case there's data in local storage BUT response was unauthorized
        navigate("/")
      }
    }
  validateUser()
  }, [])


  return (
    <AppContext.Provider value={{ state, login, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;

export const useAppContext = () => useContext(AppContext)
