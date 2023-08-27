import { FC } from "react";
import UploadFilePopup from "../components/popup/UploadFilePopup";
import { imgLimit } from "../util/auth";

const NewPopupTest: FC = () => {
  return (
    <UploadFilePopup
      title="암호확인"
      onSubmit={(e) => console.log(e)}
      onCancel={() => window.alert("cancel")}
      confirmCondition={(value) => value !== null}
      limitImgSizeX={imgLimit.profile.imgSizeX}
      limitImgSizeY={imgLimit.profile.imgSizeY}
      limitFileSize={imgLimit.profile.fileSize}
      acceptExts={imgLimit.profile.exts}
      onError={(message) => window.alert(message)}
    />
  );
};

export default NewPopupTest;
