import { FC, useState, useRef, useEffect } from "react";
import styles from "../styles/EditableText.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

interface Props {
  text: string;
  onEdit: (value: string) => void;
  className?: string;
  editClassName?: string;
  multiline?: boolean;
  editable?: boolean;
}

const EditableText: FC<Props> = ({
  text,
  onEdit,
  className,
  editClassName,
  multiline = false,
  editable = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const edit = (value: string) => {
    setIsEditing(false);
    onEdit(value);
  };

  useEffect(() => {
    if (multiline) textareaRef.current?.focus();
    else inputRef.current?.focus();
  }, [isEditing, setIsEditing]);

  return (
    <>
      {!isEditing ? (
        <div
          className={`${cx("value")} ${className}`}
          onClick={() => {
            if (!editable) return;
            setIsEditing(true);
          }}
        >
          {value}
        </div>
      ) : multiline ? (
        <textarea
          className={`${className} ${editClassName}`}
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => edit(value)}
          onKeyDown={(e) => {
            if (!e.shiftKey && e.key === "Enter") {
              e.preventDefault();
              edit(value);
            }
          }}
          rows={1}
        ></textarea>
      ) : (
        <input
          className={`${className} ${editClassName}`}
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => edit(value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              edit(value);
            }
          }}
        ></input>
      )}
    </>
  );
};

export default EditableText;
