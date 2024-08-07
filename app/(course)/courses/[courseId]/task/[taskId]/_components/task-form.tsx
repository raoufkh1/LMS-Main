"use client"
import * as React from "react";
import "froala-editor/js/plugins.pkgd.min.js";
// import "froala-editor/js/froala_editor.pkgd.min.js";

// Require Editor CSS files.
// import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";

import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';

export function TaskForm({ defaultContext }: { defaultContext: string}) {



    return (
        <div className="App p-12">
            <FroalaEditorView model={defaultContext} />
        </div>
    );



}
