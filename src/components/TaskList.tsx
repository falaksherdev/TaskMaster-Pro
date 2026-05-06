"use client";

import { useMemo } from "react";
import {
  useTasks,
  useUpdateTask,
  useDeleteTask,
  useReorderTasks,
} from "../hooks/useTasks";
import { TaskCard } from "./TaskCard";
import { Spinner } from "./Spinner";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { openModal, setSelectedTask } from "../store/features/uiSlice";
import { TaskStatus } from "../types";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export function TaskList() {
  const dispatch = useDispatch();

  const { status, priority, search, sortBy, sortOrder } = useSelector(
    (state: RootState) => state.filters,
  );

  const { data: tasks = [], isLoading, error, refetch } = useTasks();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const reorderTasks = useReorderTasks();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    if (status !== "ALL") {
      filtered = filtered.filter((task) => task.status === status);
    }

    if (priority !== "ALL") {
      filtered = filtered.filter((task) => task.priority === priority);
    }

    if (search) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (sortBy !== "manual") {
      const priorityOrder = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };

      filtered.sort((a, b) => {
        if (sortBy === "createdAt") {
          return sortOrder === "asc"
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === "dueDate") {
          return sortOrder === "asc"
            ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
            : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        }
        if (sortBy === "priority") {
          return sortOrder === "asc"
            ? priorityOrder[a.priority] - priorityOrder[b.priority]
            : priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return 0;
      });
    } else {
      filtered.sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    return filtered;
  }, [tasks, status, priority, search, sortBy, sortOrder]);

  const handleStatusChange = (id: string, newStatus: TaskStatus) => {
    updateTask.mutate({ id, status: newStatus });
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this task?")) {
      deleteTask.mutate(id);
    }
  };

  const handleEdit = (id: string) => {
    dispatch(setSelectedTask(id));
    dispatch(openModal("EDIT"));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderTasks.mutate({
        activeId: active.id as string,
        overId: over.id as string,
      });
    }
  };

  if (isLoading) return <Spinner />;
  if (error) return <div>Error loading tasks</div>;

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-500">
        {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""} found
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No tasks found</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredTasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
