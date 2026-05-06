"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { closeModal } from "../store/features/uiSlice";
import { useCreateTask, useUpdateTask } from "../hooks/useTasks";
import { TaskPriority } from "../types";
import { X, Plus, Tag, Calendar, Clock, AlertCircle } from "lucide-react";

export function TaskModal() {
  const dispatch = useDispatch();
  const { isModalOpen, modalType, selectedTaskId } = useSelector(
    (state: RootState) => state.ui,
  );

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM" as TaskPriority,
    dueDate: new Date().toISOString().split("T")[0],
    tags: [] as string[],
    estimatedHours: 1,
  });

  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (modalType === "EDIT" && selectedTaskId) {
      const tasks = JSON.parse(
        localStorage.getItem("taskmaster_tasks") || "[]",
      );
      const task = tasks.find((t: any) => t.id === selectedTaskId);
      if (task) {
        setFormData({
          title: task.title,
          description: task.description,
          priority: task.priority,
          dueDate: task.dueDate.split("T")[0],
          tags: task.tags,
          estimatedHours: task.estimatedHours,
        });
      }
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "MEDIUM",
        dueDate: new Date().toISOString().split("T")[0],
        tags: [],
        estimatedHours: 1,
      });
    }
  }, [modalType, selectedTaskId]);

  const addTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput] });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (modalType === "CREATE") {
      await createTask.mutateAsync(formData);
    } else if (modalType === "EDIT" && selectedTaskId) {
      await updateTask.mutateAsync({ id: selectedTaskId, ...formData });
    }

    dispatch(closeModal());
  };

  if (!isModalOpen) return null;

  const priorityColors = {
    LOW: "text-blue-600 bg-blue-50 border-blue-200",
    MEDIUM: "text-orange-600 bg-orange-50 border-orange-200",
    HIGH: "text-red-600 bg-red-50 border-red-200",
    URGENT: "text-purple-600 bg-purple-50 border-purple-200",
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            {modalType === "CREATE" ? "✨ Create New Task" : "📝 Edit Task"}
          </h2>
          <button
            onClick={() => dispatch(closeModal())}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-80px)]"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:text-white"
              placeholder="e.g., Build amazing project"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:text-white resize-none"
              placeholder="Describe your task..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value as TaskPriority,
                  })
                }
                className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer ${
                  priorityColors[formData.priority]
                }`}
              >
                <option value="LOW" className="text-blue-600">
                  🟢 Low
                </option>
                <option value="MEDIUM" className="text-orange-600">
                  🟠 Medium
                </option>
                <option value="HIGH" className="text-red-600">
                  🔴 High
                </option>
                <option value="URGENT" className="text-purple-600">
                  ⚡ Urgent
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Due Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Estimated Hours
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={formData.estimatedHours}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimatedHours: parseFloat(e.target.value),
                  })
                }
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                  placeholder="Add a tag..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:text-white"
                />
              </div>
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg text-sm flex items-center gap-2 shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <Tag className="w-3 h-3 text-blue-500" />#{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-red-500 hover:text-red-700 transition-colors ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={() => dispatch(closeModal())}
              className="px-5 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createTask.isPending || updateTask.isPending}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {createTask.isPending || updateTask.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  {modalType === "CREATE" ? (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Task
                    </>
                  ) : (
                    "Update Task"
                  )}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
