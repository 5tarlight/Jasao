import { FC, useEffect, useRef, useState } from "react";
import styles from "../../styles/popup/Popup.module.scss";
import classNames from "classnames/bind";
import { stringifyByte } from "../../util/utilities";

const cx = classNames.bind(styles);

interface Props {
  file?: File;
  onFileChanged?: (value: File | null) => void;
  defaultPreview?: string;
  preview?: boolean;
  limitImgSizeX?: number;
  limitImgSizeY?: number;
  limitFileSize?: number;
  onError?: (message: string) => void;
  acceptExts?: string;
}

const UploadFile: FC<Props> = ({
  file,
  onFileChanged,
  defaultPreview,
  preview = false,
  limitFileSize,
  limitImgSizeX,
  limitImgSizeY,
  onError,
  acceptExts,
}) => {
  const [fileData, setFileData] = useState<File | null>(file ? file : null);
  const [img, setImg] = useState<any>(defaultPreview);
  const [error, setError] = useState(!preview);
  const imgRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (onFileChanged) onFileChanged(fileData);
  }, [onFileChanged, fileData]);
  useEffect(() => {
    if (imgRef.current && limitImgSizeX && limitImgSizeY) {
      imgRef.current.onload = (e) => {
        const w = imgRef.current?.naturalWidth;
        const h = imgRef.current?.naturalHeight;

        if (onError && ((w && w > limitImgSizeX) || (h && h > limitImgSizeY))) {
          onError(
            `이미지 크기는 ${limitImgSizeX}x${limitImgSizeY} 이내여야 합니다.`
          );
          if (inputRef.current) inputRef.current.files = null;
          setError(true);
          setFileData(null);
          imgRef.current.src = "";
        }
      };
      imgRef.current.src = img;
    }
    // eslint-disable-next-line
  }, [img, imgRef, inputRef, limitImgSizeX, limitImgSizeY]);

  return (
    <>
      <img
        src={img}
        alt="preview upload"
        className={cx("upload-preview")}
        onLoad={(e) => setError(false)}
        onError={(e) => setError(true)}
        hidden={error}
      ></img>
      <div className={cx("filebox")}>
        <input
          className={cx("input", "upload-input")}
          value={fileData ? fileData.name : ""}
          readOnly
          placeholder="첨부파일"
        />
        <label className={cx("button", "button-confirm")} htmlFor="file">
          찾기
        </label>
        <input
          ref={inputRef}
          type="file"
          id="file"
          accept={acceptExts ? acceptExts : ""}
          onChange={(e) => {
            if (e.target.files) setFileData(e.target.files[0]);

            if (e.target.files && e.target.files[0]) {
              if (
                limitFileSize &&
                e.target.files[0].size > limitFileSize &&
                onError
              ) {
                onError(
                  `파일의 크기는 ${stringifyByte(
                    limitFileSize
                  )}을 넘을 수 없습니다.`
                );
                e.target.files = null;
                setFileData(null);
                setError(true);
                return;
              }

              var reader = new FileReader();

              reader.onload = function (e) {
                setImg(e.target?.result);
              };

              reader.readAsDataURL(e.target.files[0]);
            }
          }}
        />

        <img ref={imgRef} style={{ display: "none" }} alt="size test"></img>
      </div>
    </>
  );
};

export default UploadFile;
