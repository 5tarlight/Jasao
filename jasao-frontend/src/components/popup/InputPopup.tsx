import { FC, useRef, useState } from "react";
// import styles from "../../styles/popup/Popup.module.scss";
// import classNames from "classnames/bind";
import Popup, { buttonType } from "./Popup";

// const cx = classNames.bind(styles);

interface SubmitEventArgs {
  value: string;
}

interface Props {
  backgroundOpacity?: number;
  width?: number;
  buttonText?: {
    cancel?: string;
    confirm?: string;
  };
  button?: buttonType[];
  title?: string;
  message?: string;
  defaultValue?: string;
  onSubmit?: (e: SubmitEventArgs) => void;
  onCancel?: () => void;
  confirmCondition?: (e: SubmitEventArgs) => boolean;
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  inputType?: React.HTMLInputTypeAttribute;
}

const InputPopup: FC<Props> = ({
  defaultValue = "",
  inputType = "text",
  onCancel,
  confirmCondition = () => true,
  message,
  onSubmit,
  onVisibleChange,
  title,
  visible,
  backgroundOpacity,
  button,
  buttonText,
  width,
}) => {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Popup
      title={title}
      message={message}
      visible={visible}
      onVisibleChange={onVisibleChange}
      backgroundOpacity={backgroundOpacity}
      button={button}
      buttonText={buttonText}
      width={width}
      confirmCondition={() => confirmCondition({ value })}
      onButtonClick={(btn) => {
        if (btn === "confirm" && onSubmit) {
          onSubmit({ value });
          setValue("");
        } else if (btn === "cancel" && onCancel) {
          onCancel();
          setValue("");
        }
      }}
    >
      <input
        ref={inputRef}
        value={value}
        type={inputType}
        onChange={(e) => setValue(e.target.value)}
      ></input>
    </Popup>
  );
};

export default InputPopup;
