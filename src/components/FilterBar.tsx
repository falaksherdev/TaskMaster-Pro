"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import {
  setStatusFilter,
  setPriorityFilter,
  setSearch,
  setSortBy,
  setSortOrder,
  resetFilters,
} from "@/src/store/features/filterSlice";
import {
  Search,
  X,
  ArrowUpDown,
  GripVertical,
  Filter,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";

export function FilterBar() {
  const dispatch = useDispatch();
  const { status, priority, search, sortBy, sortOrder } = useSelector(
    (state: RootState) => state.filters,
  );

  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const hasActiveFilters =
    status !== "ALL" || priority !== "ALL" || search !== "";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-200">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks by title..."
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
          />
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={status}
            onChange={(e) => dispatch(setStatusFilter(e.target.value as any))}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white cursor-pointer"
          >
            <option value="ALL">📋 All Status</option>
            <option value="TODO">⏳ To Do</option>
            <option value="IN_PROGRESS">🔄 In Progress</option>
            <option value="DONE">✅ Done</option>
            <option value="ARCHIVED">📦 Archived</option>
          </select>

          <select
            value={priority}
            onChange={(e) => dispatch(setPriorityFilter(e.target.value as any))}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white cursor-pointer"
          >
            <option value="ALL">🎯 All Priority</option>
            <option value="LOW">🟢 Low</option>
            <option value="MEDIUM">🟠 Medium</option>
            <option value="HIGH">🔴 High</option>
            <option value="URGENT">⚡ Urgent</option>
          </select>

          <div className="flex gap-1 bg-gray-50 dark:bg-gray-900 rounded-lg p-1">
            <button
              onClick={() => dispatch(setSortBy("manual"))}
              className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1 transition-all duration-200 ${
                sortBy === "manual"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <GripVertical className="w-3 h-3" />
              Manual
            </button>
            <button
              onClick={() => dispatch(setSortBy("createdAt"))}
              className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1 transition-all duration-200 ${
                sortBy === "createdAt"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <ArrowUpDown className="w-3 h-3" />
              By Date
            </button>
          </div>

          {sortBy !== "manual" && (
            <select
              value={sortOrder}
              onChange={(e) =>
                dispatch(setSortOrder(e.target.value as "asc" | "desc"))
              }
              className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white cursor-pointer"
            >
              <option value="desc">📅 Newest First</option>
              <option value="asc">📅 Oldest First</option>
            </select>
          )}

          {hasActiveFilters && (
            <button
              onClick={() => dispatch(resetFilters())}
              className="flex items-center gap-1 px-3 py-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-all duration-200 text-sm"
            >
              <X className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-2 text-xs">
            <span className="text-gray-500 dark:text-gray-400">
              Active filters:
            </span>
            {status !== "ALL" && (
              <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md">
                Status: {status}
              </span>
            )}
            {priority !== "ALL" && (
              <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md">
                Priority: {priority}
              </span>
            )}
            {search && (
              <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md">
                Search: {search}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
