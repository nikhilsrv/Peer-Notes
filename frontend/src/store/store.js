import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import notesReducer from './slices/notesSlice.js'
import adminReducer from "./slices/adminSlice.js"
export const store=configureStore({
    reducer:{
        auth:authReducer,
        notes:notesReducer,
        admin:adminReducer
    }
})