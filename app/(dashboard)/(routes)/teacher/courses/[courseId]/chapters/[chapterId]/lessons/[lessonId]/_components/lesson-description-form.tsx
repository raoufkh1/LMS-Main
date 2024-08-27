"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Lesson } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
import "froala-editor/js/plugins.pkgd.min.js";
// import "froala-editor/js/froala_editor.pkgd.min.js";

// Require Editor CSS files.
// import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, ImageUpload, Alignment, ImageInsert, Bold, Essentials, Italic, Mention, CloudServices, Paragraph, TextPartLanguage, Undo, Base64UploadAdapter, Heading, FontFamily, FontSize, FontColor, FontBackgroundColor, Strikethrough, Subscript, Superscript, Link, UploadImageCommand, Image, BlockQuote, CodeBlock, TodoList, OutdentCodeBlockCommand, Indent, ImageCaption, ImageResize, ImageStyle, ImageToolbar, IndentBlock, MediaEmbed, List, PasteFromOffice, PictureEditing, TableColumnResize, Table, TextTransformation, TableToolbar, Underline, Autoformat, CKFinder, CKFinderUploadAdapter } from 'ckeditor5';
import { ImportWord, ImportWordEditing } from 'ckeditor5-premium-features';

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';
interface LessonDescriptionFormProps {
  initialData: Lesson;
  courseId: string;
  chapterId: string;
  lessonId: string;
}
import Froala from "react-froala-wysiwyg";

const formSchema = z.object({
  description: z.string().min(1),
});

export const LessonDescriptionForm = ({
  initialData,
  courseId,
  chapterId,
  lessonId,
}: LessonDescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || "",
    },
  });

  const froalaEditorConfig = {
    readonly: true,
    direction: "rtl",
    attribution: false,
    height: 400,
    quickInsertEnabled: false,
    imageDefaultWidth: 0,
    imageResizeWithPercent: true,
    imageMultipleStyles: false,
    imageOutputSize: true,
    imageRoundPercent: true,
    imageMaxSize: 1024 * 1024 * 2.5,
    imageEditButtons: [
      "imageReplace",
      "imageAlign",
      "imageRemove",
      "imageSize",
      "-",
      "imageLink",
      "linkOpen",
      "linkEdit",
      "linkRemove"
    ],
    imageAllowedTypes: ["jpeg", "jpg", "png", "gif"],
    imageInsertButtons: ["imageBack", "|", "imageUpload"],
    placeholderText: "Your content goes here!",
    colorsStep: 5,
    colorsText: [
      "#000000",
      "#2C2E2F",
      "#6C7378",
      "#FFFFFF",
      "#009CDE",
      "#003087",
      "#FF9600",
      "#00CF92",
      "#DE0063",
      "#640487",
      "REMOVE"
    ],
    colorsBackground: [
      "#000000",
      "#2C2E2F",
      "#6C7378",
      "#FFFFFF",
      "#009CDE",
      "#003087",
      "#FF9600",
      "#00CF92",
      "#DE0063",
      "#640487",
      "REMOVE"
    ],
    toolbarButtons: {
      moreText: {
        buttons: [
          "paragraphFormat",
          "|",
          "fontSize",
          "textColor",
          "backgroundColor",
          "insertImage",
          "alignLeft",
          "alignRight",
          "alignJustify",
          "formatOL",
          "formatUL",
          "indent",
          "outdent"
        ],
        buttonsVisible: 6
      },
      moreRich: {
        buttons: [
          "|",
          "bold",
          "italic",
          "underline",
          "insertHR",
          "insertLink",
          "insertTable"
        ],
        name: "additionals",
        buttonsVisible: 3
      },
      dummySection: {
        buttons: ["|"]
      },
      moreMisc: {
        buttons: ["|", "undo", "redo", "help", "|"],
        align: "right",
        buttonsVisible: 2
      }
    },
    tableEditButtons: [
      "tableHeader",
      "tableRemove",
      "tableRows",
      "tableColumns",
      "tableStyle",
      "-",
      "tableCells",
      "tableCellBackground",
      "tableCellVerticalAlign",
      "tableCellHorizontalAlign"
    ],
    tableStyles: {
      grayTableBorder: "Gray Table Border",
      blackTableBorder: "Black Table Border",
      noTableBorder: "No Table Border"
    },
    toolbarSticky: true,
    pluginsEnabled: [
      "align",
      "colors",
      "entities",
      "fontSize",
      "help",
      "image",
      "link",
      "lists",
      "paragraphFormat",
      "paragraphStyle",
      "save",
      "table",
      "wordPaste"
    ],
    events: {
      'image.beforeUpload': function (files: any) {
        var editor: any = this;
        if (files.length) {
          // Create a File Reader.
          var reader = new FileReader();
          // Set the reader to insert images when they are loaded.
          reader.onload = function (e: any) {
            var result = e.target.result;
            editor.image.insert(result, null, null, editor.image.get());
          };
          // Read image as base64.
          reader.readAsDataURL(files[0]);
        }
        editor.popups.hideAll();
        // Stop default upload chain.
        return false;
      }
    },
  };

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`,
        values
      );
      toast.success("تم تحديث الدرس");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("هناك شئ غير صحيح");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        وصف الدرس
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>إلغاء</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              تحرير الوصف
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.description && "text-slate-500 italic"
          )}
        >
          {!initialData.description && "بدون وصف"}
          {initialData.description && (
            <div className="ck ck-reset ck-editor ck-rounded-corners" role="application" dir="rtl" lang="ar" aria-labelledby="ck-editor__label_e5ec4d5affe02b22e9b21b94cdac3388f">
              <div className="ck ck-editor__main" role="presentation">
                <div style={{ border: "none" }} className="ck-blurred ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-read-only" lang="ar" dir="rtl" role="textbox" aria-label="Editor editing area: main" contentEditable="false">

                  <FroalaEditorView model={form.getValues().description} />

                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CKEditor
                      editor={ClassicEditor}
                      onChange={(e, editor) => {
                        const data = editor.data.get()
                        form.setValue("description", data)
                      }}
                      config={{
                        fontColor: {
                          colors: [
                            {
                              color: 'hsl(0, 0%, 0%)',
                              label: 'Black'
                            },
                            {
                              color: 'hsl(0, 0%, 30%)',
                              label: 'Dim grey'
                            },
                            {
                              color: 'hsl(0, 0%, 60%)',
                              label: 'Grey'
                            },
                            {
                              color: 'hsl(0, 0%, 90%)',
                              label: 'Light grey'
                            },
                            {
                              color: 'hsl(0, 0%, 100%)',
                              label: 'White',
                              hasBorder: true
                            },
                            // More colors.
                            // ...
                          ]
                        },
                        fontBackgroundColor: {
                          colors: [
                            {
                              color: 'hsl(0, 75%, 60%)',
                              label: 'Red'
                            },
                            {
                              color: 'hsl(30, 75%, 60%)',
                              label: 'Orange'
                            },
                            {
                              color: 'hsl(60, 75%, 60%)',
                              label: 'Yellow'
                            },
                            {
                              color: 'hsl(90, 75%, 60%)',
                              label: 'Light green'
                            },
                            {
                              color: 'hsl(120, 75%, 60%)',
                              label: 'Green'
                            },
                            // More colors.
                            // ...
                          ]
                        },
                        language: {
                          content: 'ar',
                        },
                        plugins: [Autoformat,
                          BlockQuote,
                          Bold,
                          CKFinder,
                          CKFinderUploadAdapter,
                          CloudServices,
                          Essentials,
                          Heading,
                          Image,
                          ImageCaption,
                          ImageResize,
                          ImageStyle,
                          ImageToolbar,
                          ImageUpload,
                          Base64UploadAdapter,
                          Indent,
                          IndentBlock,
                          Italic,
                          Link,
                          List,
                          MediaEmbed,
                          Mention,
                          Paragraph,
                          PasteFromOffice,
                          PictureEditing,
                          Table,
                          TableColumnResize,
                          TableToolbar,
                          TextTransformation,
                          Underline,
                          Alignment],
                        toolbar: [
                          'undo',
                          'redo',
                          '|',
                          'heading',
                          '|',
                          'bold',
                          'italic',
                          'underline',
                          '|',
                          'link',
                          'uploadImage',
                          'ckbox',
                          'insertTable',
                          'blockQuote',
                          'mediaEmbed',
                          '|',
                          'bulletedList',
                          'numberedList',
                          '|',
                          'outdent',
                          'indent',
                          'alignment'
                        ],
                        heading: {
                          options: [
                            {
                              model: 'paragraph',
                              title: 'Paragraph',
                              class: 'ck-heading_paragraph',
                            },
                            {
                              model: 'heading1',
                              view: 'h1',
                              title: 'Heading 1',
                              class: 'ck-heading_heading1',
                            },
                            {
                              model: 'heading2',
                              view: 'h2',
                              title: 'Heading 2',
                              class: 'ck-heading_heading2',
                            },
                            {
                              model: 'heading3',
                              view: 'h3',
                              title: 'Heading 3',
                              class: 'ck-heading_heading3',
                            },
                            {
                              model: 'heading4',
                              view: 'h4',
                              title: 'Heading 4',
                              class: 'ck-heading_heading4',
                            },
                          ],
                        },

                        licenseKey: 'bE0wYlJQa085OGNKM002ZlliYW9WUjVaOWptVXpadWJHaUJ1WThxUmFlZVoyS0JTb2cwNXhQMUw4YSs3TlE9PS1NakF5TkRBNU1Eaz0=',


                        initialData: form.getValues("description"),
                        image: {
                          resizeOptions: [
                            {
                              name: 'resizeImage:original',
                              label: 'Default image width',
                              value: null,
                            },
                            {
                              name: 'resizeImage:50',
                              label: '50% page width',
                              value: '50',
                            },
                            {
                              name: 'resizeImage:75',
                              label: '75% page width',
                              value: '75',
                            },
                          ],
                          toolbar: [
                            'imageTextAlternative',
                            'toggleImageCaption',
                            '|',
                            'imageStyle:inline',
                            'imageStyle:wrapText',
                            'imageStyle:breakText',
                            '|',
                            'resizeImage',
                          ],
                        },
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={isSubmitting} type="submit">
                حفظ
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
