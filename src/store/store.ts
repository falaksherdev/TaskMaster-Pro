import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./features/uiSlice"
import filterReducer from "./features/filterSlice"
import themeReducer from "./features/themeSlice"

export const store = configureStore({
    reducer: {
        ui: uiReducer,
        filters: filterReducer,
        theme: themeReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch