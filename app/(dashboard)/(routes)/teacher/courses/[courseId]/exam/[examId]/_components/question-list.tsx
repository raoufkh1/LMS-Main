"use client";

import { Chapter, ExamQuestion, Lesson } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Delete ,Grip, Pencil } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";

interface QuestionListProps {
  items: ExamQuestion[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
  OnDelete: (id: string)  => void;
}

export const QuestionList = ({
  items,
  onReorder,
  onEdit,
  OnDelete,
}: QuestionListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [questions, setQuestions] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setQuestions(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedQuestions = items.slice(startIndex, endIndex + 1);

    setQuestions(items);
    const bulkUpdateData = updatedQuestions.map((question) => ({
     
      id: question.id,
      position: items.findIndex((item) => item.id === question.id),
    }));

    onReorder(bulkUpdateData);
  };

  if (!isMounted) {
    return null;
  }

  return (
  
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {/* {console.log(questions.sort(x => x.position))} */}
            {questions.sort((a, b) => a.position - b.position).map((question, index) => (
              <Draggable
                key={question.id}
                draggableId={question.id}
                index={index}
              >
                {(provided) => (
                  <div
                    className={cn(
                      "flex items-center bg-sky-100 border-sky-200 text-sky-700 gap-x-2 border rounded-md mb-4 text-sm",
                      question.isPublished &&
                        "bg-green-100 border-green-200 text-green-700"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        "px-2 py-3 border-r border-r-sky-200 hover:bg-sky-200 rounded-l-md transition"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-5 w-5" />
                    </div>
                    <FroalaEditorView model={question.prompt} />
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                      <Badge
                        className={cn(
                          "bg-slate-500",
                          question.isPublished && "bg-sky-700"
                        )}
                      >
                        {question.isPublished ? "نشرت" : "مسودة"}
                      </Badge>
                      <Delete
                          onClick={() => { OnDelete(question.id)}}
                          className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                        />
                      <Pencil
                        onClick={() => onEdit(question.id)}
                        className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
