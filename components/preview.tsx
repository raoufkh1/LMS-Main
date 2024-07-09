"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import "react-quill/dist/quill.bubble.css";

interface PreviewProps {
  value: string;
  classname?: string;
};

export const Preview = ({
  value,
  classname
}: PreviewProps) => {
  const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), []);

  return (
    <ReactQuill
      theme="bubble"
      style={{fontFamily: "sans-serif"}}
      className={classname}
      value={value}
      readOnly
    />
  );
};
