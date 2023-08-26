import { FC } from "react";
import Popup from "../components/popup/Popup";
import { getCdn } from "../util/server";
import { getStorage } from "../util/storage";
// import { validate } from "../util/auth";

const PopupTest: FC = () => {
  return (
    <>
      <Popup
        title="POPUP TEST"
        type="upload"
        visible
        onClose={(e) => {
          if (e.button === "confirm") {
            window.alert(e.upload?.file?.name);
          }
        }}
        upload={{
          defaultPreview: `${getCdn()}/${getStorage()?.user?.profile!}`,
          confirmCondition: (value) => value !== null,
        }}
      />
    </>
  );
};

export default PopupTest;
