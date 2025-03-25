import { createContext, useReducer } from "react";

import PostsContext from "./createPostContext";
// export PostsContext = createContext()

// export const postsReducer
const postsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_POSTS':
            return {
                posts: action.payload
            }
        case 'CREATE_POST':
            return {
                posts: [action.payload, ...state.posts]
            }
        case 'DELETE_POST':
            return {
                posts: state.posts.filter((p) => p._id !== action.payload._id)
            }
        case 'UPDATE_POST':
            return {
                posts: state.posts.map((p) =>
                    p._id === action.payload._id ? { ...p, ...action.payload } : p
                )
            }
        default:
            return state
    }
}

export const PostsContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(postsReducer, {
        posts: []
    })

    return (
        <PostsContext.Provider value={{ ...state, dispatch }}>
            {children}
        </PostsContext.Provider>
    )
}