import { FC, useCallback, useEffect, useState } from "react";
import styles from "../../styles/popup/Popup.module.scss";
import classNames from "classnames/bind";
import Input from "./Input";

const cx = classNames.bind(styles);

type popupType = "none" | "input";
type buttonType = "cancel" | "confirm";

interface closeEventArgs {
  type: popupType;
  button: buttonType;
  value: string;
}

interface Props {
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  type?: popupType;
  backgroundOpacity?: number;
  width?: number;
  title?: string;
  onClose?: (e: closeEventArgs) => void;
  value?: string;
  confirmText?: string;
  cancelText?: string;
  button?: buttonType[];
  inputType?: React.HTMLInputTypeAttribute;
  confirmCondition?: (value: string) => boolean;
  message?: string;
}

const Popup: FC<Props> = ({
  visible = true,
  onVisibleChange,
  backgroundOpacity = 0.5,
  type = "none",
  width = 400,
  title,
  onClose,
  value: defaultValue = "",
  message,
  confirmText = "확인",
  cancelText = "취소",
  button = ["cancel", "confirm"],
  confirmCondition = () => true,
  inputType,
}) => {
  const [value, setValue] = useState(defaultValue);
  const [btnEnable, setBtnEnable] = useState(confirmCondition(value));

  const onClick = (button: buttonType) => {
    switch (button) {
      case "confirm":
        if (btnEnable) close(button);
        return;
    }

    close(button);
  };

  const close = (button: buttonType) => {
    if (onVisibleChange) onVisibleChange(false);
    if (onClose)
      onClose({
        type,
        button,
        value,
      });

    setValue("");
  };

  const content = () => {
    switch (type) {
      case "input":
        return (
          <Input value={value} onValueChange={setValue} inputType={inputType} />
        );
    }
  };

  const checkCondition = useCallback(
    () => confirmCondition(value),
    [confirmCondition, value]
  );

  useEffect(() => {
    setBtnEnable(checkCondition());
  }, [value, checkCondition]);

  return visible ? (
    <div
      className={cx("popup-background")}
      style={{ backgroundColor: `rgba(0, 0, 0, ${backgroundOpacity})` }}
      onKeyDown={(e) => {
        if (e.key === "Enter") onClick("confirm");
        else if (e.key === "Escape") onClick("cancel");
      }}
      tabIndex={-1}
    >
      <div
        className={cx("popup-box")}
        style={{
          width,
          maxWidth: width,
        }}
      >
        {title ? <div className={cx("title")}>{title}</div> : undefined}
        {message ? <div className={cx("message")}>{message}</div> : undefined}
        {content()}
        <div className={cx("button-wrapper")}>
          {button.includes("cancel") ? (
            <button
              className={cx("button", "button-cancel")}
              onClick={() => onClick("cancel")}
            >
              {cancelText}
            </button>
          ) : undefined}

          {button.includes("confirm") ? (
            <button
              className={cx("button", "button-confirm")}
              onClick={() => onClick("confirm")}
              disabled={!btnEnable}
            >
              {confirmText}
            </button>
          ) : undefined}
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Popup;
