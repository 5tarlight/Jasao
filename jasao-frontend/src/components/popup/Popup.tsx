import { FC, useCallback, useEffect, useRef, useState } from "react";
import styles from "../../styles/popup/Popup.module.scss";
import classNames from "classnames/bind";
import Input from "./Input";
import UploadFile from "./UploadFile";

const cx = classNames.bind(styles);

type popupType = "none" | "input" | "upload";
type buttonType = "cancel" | "confirm";

interface closeEventArgs {
  type: popupType;
  button: buttonType;
  input?: {
    value: string;
  };
  upload?: {
    file: File | null;
  };
}

interface Props {
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  type?: popupType;
  backgroundOpacity?: number;
  width?: number;
  title?: string;
  onClose?: (e: closeEventArgs) => void;
  confirmText?: string;
  cancelText?: string;
  button?: buttonType[];
  message?: string;
  input?: {
    value?: string;
    type?: React.HTMLInputTypeAttribute;
    confirmCondition?: (value: string) => boolean;
  };

  upload?: {
    file?: File;
    defaultPreview?: string;
    preview?: boolean;
    confirmCondition?: (file: File | null) => boolean;
  };
}

const Popup: FC<Props> = ({
  visible = true,
  onVisibleChange,
  backgroundOpacity = 0.5,
  type = "none",
  width = 400,
  title,
  onClose,
  input,
  message,
  confirmText = "확인",
  cancelText = "취소",
  button = ["cancel", "confirm"],

  upload,
}) => {
  const [value, setValue] = useState(input?.value ? input.value : "");
  const [file, setFile] = useState<File | null>(null);
  const [btnEnable, setBtnEnable] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

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
    if (onClose) {
      if (type === "input")
        onClose({
          type,
          button,
          input: {
            value,
          },
        });
      else if (type === "upload")
        onClose({
          type,
          button,
          upload: {
            file,
          },
        });
    }

    setValue("");
  };

  const content = () => {
    switch (type) {
      case "input":
        return (
          <Input
            value={value}
            onValueChange={setValue}
            inputType={input?.type}
          />
        );
      case "upload":
        return (
          <UploadFile
            file={upload?.file}
            preview={upload?.preview}
            onFileChanged={(f) => setFile(f)}
          />
        );
    }
  };

  const checkCondition = useCallback(() => {
    if (type === "input" && input?.confirmCondition)
      return input?.confirmCondition(value);
    else if (type === "upload" && upload?.confirmCondition)
      return upload.confirmCondition(file);
    else return true;
  }, [input, upload, value, file, type]);

  useEffect(() => {
    setBtnEnable(checkCondition());
  }, [value, checkCondition]);

  useEffect(() => {
    divRef.current?.focus();
  }, []);

  return visible ? (
    <div
      className={cx("popup-background")}
      ref={divRef}
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
