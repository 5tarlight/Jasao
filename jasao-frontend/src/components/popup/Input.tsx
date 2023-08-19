import { FC, useEffect, useRef, useState } from "react";
import styles from "../../styles/popup/Input.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

interface Props {
  title?: string;
  defaultValue?: string;
  onInput?: (value: string) => void;
  onCancel?: () => void;
  width?: string | number;
  height?: string | number;
  cancelText?: string;
  confirmText?: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  condition?: (value: string) => boolean;
  failedText?: string;
  inputType?: React.HTMLInputTypeAttribute;
}

const InputPopup: FC<Props> = ({
  title,
  defaultValue = "",
  onInput,
  width,
  height,
  cancelText = "취소",
  confirmText = "확인",
  visible,
  setVisible,
  condition,
  onCancel,
  inputType = "text",
}) => {
  const [value, setValue] = useState(defaultValue);
  const [btnEnable, setBtnEnable] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const send = () => {
    if (onInput) onInput(value);
    close();
  };

  const close = () => {
    setVisible(false);
    setBtnEnable(false);
    setValue("");
  };

  useEffect(() => {
    inputRef?.current?.focus();
  }, [visible]);

  return visible ? (
    <div
      className={cx("popup-container")}
      style={{
        width,
        height,
      }}
    >
      <div className={cx("popup-box")}>
        <div className={cx("title")}>{title}</div>
        <div className={cx("input")}>
          <input
            className={cx("input")}
            ref={inputRef}
            value={value}
            type={inputType}
            onChange={(e) => {
              setValue(e.target.value);
              if (condition) setBtnEnable(condition(value));
            }}
            onKeyDown={(e) => {
              if (btnEnable && e.key === "Enter") send();
              else if (e.key === "Escape") {
                if (onCancel) onCancel();
                close();
              }
            }}
          ></input>
        </div>
        <div className={cx("button-wrapper")}>
          <button
            className={cx("button-cancel")}
            onClick={() => {
              if (onCancel) onCancel();
              close();
            }}
          >
            {cancelText}
          </button>
          <button onClick={() => send()} disabled={!btnEnable}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default InputPopup;
