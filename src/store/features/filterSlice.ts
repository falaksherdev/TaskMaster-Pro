import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { FilterState } from '@/src/types';

const initialState: FilterState = {
    status: "ALL",
    priority: "ALL",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc"
}

const filterSlice = createSlice({
    name: "filters",
    initialState,
    reducers: {
        setStatusFilter: (state, action: PayloadAction<FilterState['status']>) => {
            state.status = action.payload
        },
        setPriorityFilter: (state, action: PayloadAction<FilterState['priority']>) => {
            state.priority = action.payload
        },
        setSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload
        },
        setSortBy: (state, action: PayloadAction<FilterState['sortBy']>) => {
            state.sortBy = action.payload
        },
        setSortOrder: (state, action: PayloadAction<FilterState['sortOrder']>) => {
            state.sortOrder = action.payload
        },
        resetFilters: (state) => {
            return initialState
        }
    }
})
export const {
    setStatusFilter,
    setPriorityFilter,
    setSearch,
    setSortBy,
    setSortOrder,
    resetFilters,
} = filterSlice.actions;
export default filterSlice.reducer;