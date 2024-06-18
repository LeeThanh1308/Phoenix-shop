import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
];

function TextEditer({
  getValue = (value) => {},
  data = "",
  placeholder,
  ...props
}) {
  const [value, setValue] = useState(data);
  return (
    <ReactQuill
      theme="snow"
      value={value}
      modules={modules}
      formats={formats}
      onChange={(value) => {
        setValue(value);
        getValue(value);
      }}
      onSetValue={(value) => {
        setValue(value);
      }}
    />
  );
}

export default TextEditer;
