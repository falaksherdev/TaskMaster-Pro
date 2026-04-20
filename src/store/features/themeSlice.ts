import { createSlice } from "@reduxjs/toolkit";
import { ThemeState } from "@/src/types";

const initialState: ThemeState = {
    mode: "LIGHT"
}

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.mode = state.mode === "LIGHT" ? "DARK" : "LIGHT"

            if (state.mode === "DARK") {
                document.documentElement.classList.add("dark")
            }
            else {
                document.documentElement.classList.remove("dark")
            }
        }
    }
})

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer