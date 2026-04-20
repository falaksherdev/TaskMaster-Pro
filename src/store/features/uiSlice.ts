import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UIState } from "@/src/types";


const initialState: UIState = {
    isModalOpen: false,
    modalType: null,
    selectedTaskId: null,
    isLoading: false
}

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        openModal: (state, action: PayloadAction<'CREATE' | 'EDIT'>) => {
            state.isModalOpen = true
            state.modalType = action.payload
        },
        closeModal: (state) => {
            state.isModalOpen = false
            state.modalType = null
            state.selectedTaskId = null
        },
        setSelectedTask: (state, action: PayloadAction<string>) => {
            state.selectedTaskId = action.payload
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        }
    }
})
export const { openModal, closeModal, setSelectedTask, setLoading } = uiSlice.actions
export default uiSlice.reducer