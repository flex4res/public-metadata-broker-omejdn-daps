import {
  USERS_LOADING,
  GET_USERS,
  ADD_USER,
  UPDATE_USER,
  DELETE_USER,
  CLEAR_USER
} from '../actions/types';

const initialState = {
  users: [],
  loading: false,
  userAdded: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case USERS_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_USERS:
      return {
        ...state,
        users: action.payload,
        loading: false
      };
    case ADD_USER:
      return {
        ...state,
        users: [...state.users, action.payload],
        userAdded: true
      };
    case UPDATE_USER:
      const index = state.users.findIndex(
        user => user._id === action.payload._id);
      return {
        ...state,
        users: [
          ...state.users.slice(0, index),
          action.payload,
          ...state.users.slice(index + 1)
        ]
      };
    case DELETE_USER:
     return {
       ...state,
       users: state.users.filter(user => user._id !== action.payload)
     };
    case CLEAR_USER:
      return {
        ...state,
        userAdded: false
      };
    default:
      return state;
  }
}
