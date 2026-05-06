"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, TaskStatus } from "@/src/types";
import { GripVertical, Edit, Trash2, Calendar, Clock, Tag } from "lucide-react";

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
        return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
      case "IN_PROGRESS":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400";
      case "DONE":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
      case "ARCHIVED":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
      default:
        return "bg-gray-100 dark:bg-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "LOW":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
      case "MEDIUM":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400";
      case "HIGH":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
      case "URGENT":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400";
      default:
        return "bg-gray-100 dark:bg-gray-700";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400 mt-1 transition-colors"
          >
            <GripVertical className="w-5 h-5" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {task.title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              {task.description || "No description"}
            </p>

            {/* Tags & Meta */}
            <div className="flex flex-wrap gap-2 mt-3">
              <span
                className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(task.status)}`}
              >
                {task.status}
              </span>
              <span
                className={`px-2 py-1 rounded-lg text-xs font-medium ${getPriorityColor(task.priority)}`}
              >
                {task.priority}
              </span>
              {task.tags?.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 rounded-lg text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 flex items-center gap-1"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500 dark:text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Est: {task.estimatedHours}h
                {task.actualHours && ` | Actual: ${task.actualHours}h`}
              </div>
            </div>
          </div>

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onEdit(task.id)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 ml-8">
          <select
            value={task.status}
            onChange={(e) =>
              onStatusChange(task.id, e.target.value as TaskStatus)
            }
            className="text-sm border-0 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white cursor-pointer"
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
