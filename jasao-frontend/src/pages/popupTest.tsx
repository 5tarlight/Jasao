import { FC } from "react";
import Popup from "../components/popup/Popup";
import { validate } from "../util/auth";

const PopupTest: FC = () => {
  return (
    <>
      <Popup
        title="hello"
        value="asdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd"
        visible
        confirmCondition={(value) => validate("password", value)}
        onClose={(e) => {
          window.confirm(e.button);
        }}
      />
    </>
  );
};

export default PopupTest;
