import { FC, useState } from "react";
import styles from "../styles/Test.module.scss";
import classNames from "classnames/bind";
import axios from "axios";
import { getServer } from "../../util/server";
import { getStorage } from "../../util/storage";

const cx = classNames.bind(styles);

const Test: FC = () => {
  const [fileData, setFileData] = useState<File>();

  return (
    <>
      <fieldset className={cx("fieldset")}>
        <legend>파일 업로드 (broken)</legend>
        <div>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => {
              if (e.target.files) setFileData(e.target.files[0]);
              console.log(e.target.files);
            }}
          />
          <button
            onClick={async () => {
              console.log(fileData);
              if (!fileData) return;

              const formData = new FormData();
              formData.append("file", fileData);
              console.log(formData);
              console.log(fileData);
              const res = await axios.post(
                `${getServer()}/file/auth/upload?role=profile`,
                formData,
                {
                  headers: {
                    Authorization: getStorage()?.login?.jwt,
                  },
                }
              );

              console.log(res.data);
            }}
          >
            전송
          </button>
        </div>
      </fieldset>
    </>
  );
};

export default Test;
