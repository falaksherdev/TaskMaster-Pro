"use client";

import { TaskList } from "@/src/components/TaskList";
import { FilterBar } from "@/src/components/FilterBar";
import { TaskModal } from "@/src/components/TaskModal";
import { useDispatch } from "react-redux";
import { openModal } from "@/src/store/features/uiSlice";
import { Plus, LayoutGrid, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/src/ThemeToggle";

export default function Home() {
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <LayoutGrid className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  TaskMaster Pro
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Manage your tasks with drag & drop
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={() => dispatch(openModal("CREATE"))}
                className="group relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                <span className="font-medium">Add Task</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-6">
          <FilterBar />
          <TaskList />
        </div>

        <TaskModal />
      </div>
    </div>
  );
}
