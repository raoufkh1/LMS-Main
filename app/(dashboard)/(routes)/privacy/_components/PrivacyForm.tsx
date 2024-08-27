"use client"
import * as React from "react";
import "froala-editor/js/plugins.pkgd.min.js";
// import "froala-editor/js/froala_editor.pkgd.min.js";

// Require Editor CSS files.
// import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";

import Froala from "react-froala-wysiwyg";
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';

import { Preview } from "@/components/preview";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axios from "axios";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, ImageUpload, Alignment, ImageInsert, Bold, Essentials, Italic, Mention, CloudServices, Paragraph, TextPartLanguage, Undo, Base64UploadAdapter, Heading, FontFamily, FontSize, FontColor, FontBackgroundColor, Strikethrough, Subscript, Superscript, Link, UploadImageCommand, Image, BlockQuote, CodeBlock, TodoList, OutdentCodeBlockCommand, Indent, ImageCaption, ImageResize, ImageStyle, ImageToolbar, IndentBlock, MediaEmbed, List, PasteFromOffice, PictureEditing, TableColumnResize, Table, TextTransformation, TableToolbar, Underline, Autoformat, CKFinder, CKFinderUploadAdapter } from 'ckeditor5';
import { ImportWord, ImportWordEditing } from 'ckeditor5-premium-features';

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';


const froalaEditorConfig2 = {
  readonly: true,
  direction: "rtl",
  attribution: false,
  height: 400,
  quickInsertEnabled: false,
  imageDefaultWidth: 0,

  imageMaxSize: 1024 * 1024 * 2.5,
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
  }

}

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


  // Set the image upload URL.

  // Additional upload params.

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

};

export function PrivacyForm({ defaultContext, isTeacher }: { defaultContext: string, isTeacher: boolean }) {
  const [context, setContext] = React.useState('')
  const [editing, setEditing] = React.useState(false)
  React.useEffect(() => {
    setContext(defaultContext)

  }, [])
  const onModelChange = (model: any) => {
    setContext(model)

  };
  const handleSubmit = async () => {
    try {
      console.log(context)
      await axios.patch(
        `/api/privacy`,
        { context: context }
      );
      toast.success("تم تحديث سياسة الخصوصية");
      setEditing(false)

    } catch (e) {
      console.log(e)
      toast.error("هناك شئ غير صحيح");
    }
  }
  return (
    <div className="App p-12">

      {
        editing && (
          <div>
            <div className="mb-6 w-full flex items-center justify-between">
              <h1 className="text-xl">اذا انتهيت</h1>
              <Button
                type="button"
                variant={"success"}
                className="w-full md:w-auto bg-sky-700 hover:bg-sky-600"
                onClick={handleSubmit}
              >
                {" حفظ"}

              </Button>
            </div>
            <CKEditor
              editor={ClassicEditor}
              onChange={(e, editor) => {
                const data = editor.data.get()
                onModelChange(data)
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


                initialData: context,
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
          </div>
        )
      }

      {
        !editing && (
          <div>
            {
              isTeacher && (
                <div className="flex w-full justify-between mb-4 items-center">
                  <h1 className="text-xl">   </h1>
                  <Button
                    type="button"
                    variant={"success"}
                    className="w-full md:w-auto bg-sky-700 hover:bg-sky-600"
                    onClick={e => { setEditing(true) }}
                  >
                    {" تعديل"}

                  </Button>

                </div>
              )
            }

            <div className="ck ck-reset ck-editor ck-rounded-corners" role="application" dir="rtl" lang="ar" aria-labelledby="ck-editor__label_e5ec4d5affe02b22e9b21b94cdac3388f">
              <div className="ck ck-editor__main" role="presentation">
                <div style={{ border: "none" }} className="ck-blurred ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-read-only" lang="ar" dir="rtl" role="textbox" aria-label="Editor editing area: main" contentEditable="false">

                  <FroalaEditorView model={context} />
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );



}
