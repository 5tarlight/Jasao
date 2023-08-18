import { FC, useState, useRef, useEffect } from "react";
import styles from "../styles/EditableText.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

interface Props {
  value: string;
  onEdit: (value: string) => void;
  onChange: (value: string) => void;
  className?: string;
  editClassName?: string;
  multiline?: boolean;
  editable?: boolean;
  condition?: (value: string) => boolean;
}

const EditableText: FC<Props> = ({
  value,
  onEdit,
  className,
  editClassName,
  multiline = false,
  editable = false,
  onChange,
  condition,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCancel, setIsCancel] = useState(false);
  const [temp, setTemp] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const edit = (value: string) => {
    if (isCancel || (condition && !condition(value))) {
      cancel();
      return;
    }

    setIsEditing(false);
    onEdit(value);
  };

  const cancel = () => {
    if (multiline) textareaRef.current?.blur();
    else inputRef.current?.blur();
    onChange(temp);
    setIsEditing(false);
    setIsCancel(false);
  };

  useEffect(() => {
    if (multiline) textareaRef.current?.focus();
    else inputRef.current?.focus();

    // eslint-disable-next-line
  }, [isEditing, setIsEditing]);

  useEffect(() => {
    if (isCancel) cancel();

    // eslint-disable-next-line
  }, [isCancel]);

  return (
    <>
      {!isEditing ? (
        <div
          className={`${cx("value")} ${className}`}
          onClick={() => {
            if (!editable) return;
            setTemp(value);
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
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => edit(value)}
          onKeyDown={(e) => {
            if (!e.shiftKey && e.key === "Enter") {
              e.preventDefault();
              edit(value);
            } else if (e.key === "Escape") {
              setIsCancel(true);
            }
          }}
          rows={1}
        ></textarea>
      ) : (
        <input
          className={`${className} ${editClassName}`}
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => edit(value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              edit(value);
            } else if (e.key === "Escape") {
              setIsCancel(true);
            }
          }}
        ></input>
      )}
    </>
  );
};

export default EditableText;
