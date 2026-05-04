"use client";

import { TaskList } from "@/src/components/TaskList";
import { FilterBar } from "@/src/components/FilterBar";
import { TaskModal } from "@/src/components/TaskModal";
import { useDispatch } from "react-redux";
import { openModal } from "@/src/store/features/uiSlice";
import { Plus } from "lucide-react";

export default function Home() {
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              📋 TaskMaster Pro
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage your tasks with drag & drop
            </p>
          </div>
          <button
            onClick={() => dispatch(openModal("CREATE"))}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>

        <FilterBar />

        <TaskList />

        <TaskModal />
      </div>
    </div>
  );
}
