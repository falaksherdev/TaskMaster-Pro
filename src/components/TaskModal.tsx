"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { closeModal } from "../store/features/uiSlice";
import { useCreateTask, useUpdateTask } from "../hooks/useTasks";
import { TaskPriority } from "../types";

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {modalType === "CREATE" ? "➕ Add New Task" : "✏️ Edit Task"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value as TaskPriority,
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="LOW">🟢 Low</option>
                <option value="MEDIUM">🟠 Medium</option>
                <option value="HIGH">🔴 High</option>
                <option value="URGENT">⚡ Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Estimated Hours
            </label>
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
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                placeholder="Add tag"
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 rounded-md text-sm flex items-center gap-1"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-red-500 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => dispatch(closeModal())}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createTask.isPending || updateTask.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {createTask.isPending || updateTask.isPending
                ? "Saving..."
                : modalType === "CREATE"
                  ? "Create"
                  : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
