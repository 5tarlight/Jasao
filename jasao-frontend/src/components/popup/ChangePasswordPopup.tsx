import { FC, useState } from "react";
import styles from "../../styles/popup/Popup.module.scss";
import classNames from "classnames/bind";
import Popup, { buttonType } from "./Popup";

const cx = classNames.bind(styles);

interface SubmitEventArgs {
  curPw: string;
  newPw: string;
}

interface Props {
  backgroundOpacity?: number;
  width?: number;
  buttonText?: {
    cancel?: string;
    confirm?: string;
  };
  title?: string;
  message?: string;
  onSubmit?: (e: SubmitEventArgs) => void;
  onCancel?: () => void;
  confirmCondition?: (e: SubmitEventArgs) => boolean;
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  button?: buttonType[];
}

const ChangePasswordPopup: FC<Props> = ({
  title,
  message,
  onSubmit,
  onCancel,
  confirmCondition = () => true,
  visible,
  onVisibleChange,
  backgroundOpacity,
  buttonText,
  width,
  button,
}) => {
  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPwConfirm, setNewPwConfirm] = useState("");

  const refresh = () => {
    setCurPw("");
    setNewPw("");
    setNewPwConfirm("");
  };

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
      onButtonClick={(btn) => {
        if (btn === "confirm" && onSubmit) {
          onSubmit({ curPw, newPw });
          refresh();
        } else if (btn === "cancel" && onCancel) {
          onCancel();
          refresh();
        }
      }}
      confirmCondition={() => {
        return !!(
          curPw &&
          newPw &&
          curPw !== newPw &&
          newPw === newPwConfirm &&
          confirmCondition({ curPw, newPw })
        );
      }}
    >
      <input
        className={cx("margin-bot")}
        placeholder="현재 비밀번호"
        type="password"
        value={curPw}
        onChange={(e) => setCurPw(e.target.value)}
      />
      <input
        className={cx("margin-bot")}
        placeholder="새 비밀번호"
        type="password"
        value={newPw}
        onChange={(e) => setNewPw(e.target.value)}
      />
      <input
        placeholder="새 비밀번호 확인"
        type="password"
        value={newPwConfirm}
        onChange={(e) => setNewPwConfirm(e.target.value)}
      />
    </Popup>
  );
};

export default ChangePasswordPopup;
