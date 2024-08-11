"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ExamQuestionOption } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Delete, Grip, Pencil } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface OptionListProps {
  answer: string;
  courseId: string;
  examId: string;
  questionId: string;
  items: ExamQuestionOption[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
}

export const OptionList = ({
  answer,
  items,
  courseId,
  examId,
  questionId,
  onReorder,
}: OptionListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [options, setCurrentOptions] = useState(items);
  const [currentOption, setCurrentOption] = useState<ExamQuestionOption>();

  const formSchema = z.object({
    text: z.string().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: currentOption?.text,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const router = useRouter();

  const onDelete = async (id: string) => {
    try {
      setIsDeleting(true);

      await axios.delete(
        `/api/courses/${courseId}/exam/${examId}/questions/${questionId}/options/${id}`
      );

      toast.success("تم حذف الخيار");
      router.refresh();
    } catch {
      toast.error("هناك شئ غير صحيح");
    } finally {
      setIsDeleting(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/exam/${examId}/questions/${questionId}/options/${currentOption?.id}`,
        values
      );
      toast.success("تم تحديث خيار السؤال");
      router.refresh();
    } catch (error: any) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
      toast.error(error.response.data);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setCurrentOptions(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(options);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedOptions = items.slice(startIndex, endIndex + 1);

    setCurrentOptions(items);

    const bulkUpdateData = updatedOptions.map((option) => ({
      id: option.id,
      position: items.findIndex((item) => item.id === option.id),
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
            {options.map((option, index) => (
              <Draggable key={option.id} draggableId={option.id} index={index}>
                {(provided) => (
                  <div
                    className={cn(
                      "flex items-center bg-sky-100 border-sky-200 text-sky-700 gap-x-2 border rounded-md mb-4 text-sm",
                      parseInt(answer) === index + 1 &&
                        "bg-green-100 border-green-200 text-green-700",
                      isDeleting &&
                        currentOption?.id === option.id &&
                        "bg-red-100 border-red-200 text-red-700 animate-pulse"
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
                    {option.text}
                    {!isDeleting && (
                      <div className="ml-auto pr-2 flex items-center gap-x-2">
                        <Delete
                          onClick={() => {
                            setCurrentOption(option);
                            onDelete(option.id);
                          }}
                          className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                        />
                        <Popover>
                          <PopoverTrigger>
                            <Pencil
                              onClick={() => setCurrentOption((prev) => option)}
                              className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                            />
                          </PopoverTrigger>
                          <PopoverContent>
                            <Form {...form}>
                              <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-4 mt-4"
                              >
                                <FormField
                                  control={form.control}
                                  name="text"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Option Text</FormLabel>
                                      <FormControl>
                                        <Input
                                          disabled={isSubmitting}
                                          defaultValue={option.text}
                                          placeholder={option.text}
                                          dir="rtl"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <Button
                                  disabled={!isValid || isSubmitting}
                                  type="submit"
                                >
                                  تحديث
                                </Button>
                              </form>
                            </Form>
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
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
