import { FC, useEffect, useRef, useState } from "react";
import styles from "../../styles/popup/Popup.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

interface Props {
  value?: string;
  onValueChange?: (value: string) => void;
  onInput?: (value: string) => void;
  onCancel?: () => void;
  inputType?: React.HTMLInputTypeAttribute;
}

const Input: FC<Props> = ({
  value = "",
  onInput,
  inputType = "text",
  onValueChange,
  onCancel,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const send = () => {
    if (onInput) onInput(value);
  };

  useEffect(() => {
    inputRef?.current?.focus();
  }, []);

  return (
    <input
      className={cx("input")}
      ref={inputRef}
      value={value}
      type={inputType}
      onChange={(e) => {
        if (onValueChange) onValueChange(e.target.value);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") send();
        else if (e.key === "Escape") {
          if (onCancel) onCancel();
        }
      }}
    ></input>
  );
};

export default Input;
