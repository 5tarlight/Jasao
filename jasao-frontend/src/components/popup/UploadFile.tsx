import { FC, useEffect, useState } from "react";
import styles from "../../styles/popup/Popup.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

interface Props {
  file?: File;
  onFileChanged?: (value: File | null) => void;
  defaultPreview?: string;
  preview?: boolean;
}

const UploadFile: FC<Props> = ({
  file,
  onFileChanged,
  defaultPreview,
  preview = false,
}) => {
  const [fileData, setFileData] = useState<File | null>(file ? file : null);
  const [img, setImg] = useState<any>(defaultPreview);
  const [error, setError] = useState(!preview);

  useEffect(() => {
    if (onFileChanged) onFileChanged(fileData);
  }, [onFileChanged, fileData]);

  return (
    <>
      {!error ? (
        <img
          src={img}
          alt="preview upload"
          className={cx("upload-preview")}
          onError={(e) => setError(true)}
        ></img>
      ) : undefined}

      <div className={cx("filebox")}>
        <input
          className={cx("input", "upload-input")}
          value={fileData?.name}
          readOnly
          placeholder="첨부파일"
        />
        <label className={cx("button", "button-confirm")} htmlFor="file">
          파일찾기
        </label>
        <input
          type="file"
          id="file"
          onChange={(e) => {
            if (e.target.files) setFileData(e.target.files[0]);

            if (e.target.files && e.target.files[0]) {
              setError(false);
              var reader = new FileReader();

              reader.onload = function (e) {
                setImg(e.target?.result);
              };

              reader.readAsDataURL(e.target.files[0]);
            }
          }}
        />
      </div>
    </>
  );
};

export default UploadFile;
