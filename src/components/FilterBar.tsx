"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  setStatusFilter,
  setPriorityFilter,
  setSearch,
  setSortBy,
  setSortOrder,
  resetFilters,
} from "../store/features/filterSlice";
import { Search, SlidersHorizontal, X } from "lucide-react";

export function FilterBar() {
  const dispatch = useDispatch();
  const { status, priority, search, sortBy, sortOrder } = useSelector(
    (state: RootState) => state.filters,
  );

  const hasActiveFilters =
    status !== "ALL" || priority !== "ALL" || search !== "";

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search tasks by title..."
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={status}
          onChange={(e) => dispatch(setStatusFilter(e.target.value as any))}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="ALL">All Status</option>
          <option value="TODO">📋 To Do</option>
          <option value="IN_PROGRESS">🔄 In Progress</option>
          <option value="DONE">✅ Done</option>
          <option value="ARCHIVED">📦 Archived</option>
        </select>

        <select
          value={priority}
          onChange={(e) => dispatch(setPriorityFilter(e.target.value as any))}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="ALL">All Priority</option>
          <option value="LOW">🟢 Low</option>
          <option value="MEDIUM">🟠 Medium</option>
          <option value="HIGH">🔴 High</option>
          <option value="URGENT">⚡ Urgent</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => dispatch(setSortBy(e.target.value as any))}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="createdAt">Sort by Created Date</option>
          <option value="dueDate">Sort by Due Date</option>
          <option value="priority">Sort by Priority</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => dispatch(setSortOrder(e.target.value as any))}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={() => dispatch(resetFilters())}
            className="flex items-center gap-1 px-3 py-2 text-red-600 border rounded-lg hover:bg-red-50 text-sm"
          >
            <X className="w-4 h-4" />
            Reset
          </button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t flex flex-wrap gap-2 text-xs">
          <span className="text-gray-500">Active:</span>
          {status !== "ALL" && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
              Status: {status}
            </span>
          )}
          {priority !== "ALL" && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
              Priority: {priority}
            </span>
          )}
          {search && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
              Search: {search}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
