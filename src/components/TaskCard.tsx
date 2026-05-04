"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, TaskStatus } from "../types";
import { GripVertical, Edit, Trash2 } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}
export function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "TODO":
        return "bg-gray-100 text-gray-800";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "DONE":
        return "bg-green-100 text-green-800";
      case "ARCHIVED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "LOW":
        return "bg-blue-100 text-blue-800";
      case "MEDIUM":
        return "bg-orange-100 text-orange-800";
      case "HIGH":
        return "bg-red-100 text-red-800";
      case "URGENT":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100";
    }
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 mt-1"
          >
            <GripVertical className="w-5 h-5" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {task.title}
            </h3>
            <p className="text-gray-600 mt-1 text-sm">{task.description}</p>

            <div className="flex gap-2 mt-3">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
              >
                {task.status}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}
              >
                {task.priority}
              </span>
              {task.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 rounded-full text-xs bg-gray-100"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(task.id)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 ml-8">
          <select
            value={task.status}
            onChange={(e) =>
              onStatusChange(task.id, e.target.value as TaskStatus)
            }
            className="text-sm border rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="TODO">📋 To Do</option>
            <option value="IN_PROGRESS">🔄 In Progress</option>
            <option value="DONE">✅ Done</option>
            <option value="ARCHIVED">📦 Archived</option>
          </select>
        </div>
      </div>
    </div>
  );
}
