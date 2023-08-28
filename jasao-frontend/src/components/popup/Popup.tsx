import { FC, useEffect, useRef, useState } from "react";
import styles from "../../styles/popup/Popup.module.scss";
import classNames from "classnames/bind";
import { PropsWithChildren } from "../../util/utilities";

const cx = classNames.bind(styles);

export type buttonType = "cancel" | "confirm";

interface Props {
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  confirmCondition?: () => boolean;
  backgroundOpacity?: number;
  width?: number;
  title?: string;
  onButtonClick?: (button: buttonType) => void;
  button?: buttonType[];
  buttonText?: {
    cancel?: string;
    confirm?: string;
  };
  message?: string;
}

const Popup: FC<PropsWithChildren<Props>> = ({
  visible = true,
  onVisibleChange,
  backgroundOpacity = 0.5,
  width = 400,
  title,
  onButtonClick,
  confirmCondition = () => true,
  message,
  buttonText,
  button = ["cancel", "confirm"],
  children,
}) => {
  const [isVisible, setIsVisible] = useState(visible);
  const [btnEnable, setBtnEnable] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  const onClose = (btn: buttonType) => {
    if (onButtonClick) {
      if (btn === "confirm" && !btnEnable) return;
      onButtonClick(btn);
    }
    setIsVisible(false);
    if (onVisibleChange) onVisibleChange(false);
  };

  useEffect(() => {
    setIsVisible(visible);
  }, [setIsVisible, visible]);

  useEffect(() => {
    setBtnEnable(confirmCondition());
  }, [confirmCondition, setBtnEnable]);

  return isVisible ? (
    <div
      className={cx("popup-background")}
      ref={divRef}
      style={{ backgroundColor: `rgba(0, 0, 0, ${backgroundOpacity})` }}
      onKeyDown={(e) => {
        if (e.key === "Enter") onClose("confirm");
        else if (e.key === "Escape") onClose("cancel");
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
        {children}
        <div className={cx("button-wrapper")}>
          {button.includes("cancel") ? (
            <button
              className={cx("button", "button-cancel")}
              onClick={() => onClose("cancel")}
            >
              {buttonText?.cancel ? buttonText.cancel : "취소"}
            </button>
          ) : undefined}

          {button.includes("confirm") ? (
            <button
              className={cx("button", "button-confirm")}
              onClick={() => onClose("confirm")}
              disabled={!btnEnable}
            >
              {buttonText?.confirm ? buttonText.confirm : "확인"}
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
