import { FC, useEffect, useRef, useState } from "react";
import styles from "../../styles/popup/Popup.module.scss";
import classNames from "classnames/bind";
import { stringifyByte } from "../../util/utilities";
import Popup, { buttonType } from "./Popup";

const cx = classNames.bind(styles);

interface SubmitEventArgs {
  file: File | null;
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
  onSubmit?: (e: SubmitEventArgs) => void;
  onCancel?: () => void;
  confirmCondition?: (e: SubmitEventArgs) => boolean;
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;

  defaultFile?: File;
  defaultPreview?: string;
  preview?: boolean;
  maxImgWidth?: number;
  maxImgHeight?: number;
  minImgWidth?: number;
  minImgHeight?: number;
  limitFileSize?: number;
  onError?: (message: string) => void;
  acceptExts?: string;
  deleteBtn?: boolean;
  onDelete?: () => void;
}

const UploadFilePopup: FC<Props> = ({
  backgroundOpacity,
  button,
  buttonText,
  confirmCondition = () => true,
  message,
  onCancel,
  onSubmit,
  onVisibleChange,
  title,
  visible,
  width,
  defaultFile = null,
  defaultPreview,
  preview = false,
  limitFileSize,
  maxImgWidth,
  maxImgHeight,
  onError,
  acceptExts,
  deleteBtn = false,
  onDelete = () => {},
  minImgHeight = 0,
  minImgWidth = 0,
}) => {
  const [file, setFile] = useState<File | null>(defaultFile);
  const [img, setImg] = useState<any>(defaultPreview);
  const [error, setError] = useState(!preview);
  const [imgSelected, setImgSelected] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const refresh = () => {
    setFile(null);
    setImg(null);
  };

  useEffect(() => {
    if (imgRef.current && maxImgWidth && maxImgHeight) {
      imgRef.current.onload = (e) => {
        const w = imgRef.current?.naturalWidth;
        const h = imgRef.current?.naturalHeight;

        if (onError && w && h && imgSelected) {
          if (maxImgHeight && maxImgWidth) {
            if (w > maxImgWidth || h > maxImgHeight) {
              onError(
                `이미지 크기는 ${maxImgWidth}x${maxImgHeight} 이내여야 합니다.`
              );
              if (inputRef.current) inputRef.current.files = null;
              setError(true);
              setFile(null);
              imgRef.current.src = "";
            }
          }
          if (w < minImgWidth || h < minImgHeight) {
            onError(
              `이미지 크기는 ${minImgWidth}x${minImgHeight} 이상이어야 합니다.`
            );
            if (inputRef.current) inputRef.current.files = null;
            setError(true);
            setFile(null);
            imgRef.current.src = "";
          }
        }
      };
      imgRef.current.src = img;
    }
    // eslint-disable-next-line
  }, [
    img,
    imgRef,
    inputRef,
    maxImgWidth,
    maxImgHeight,
    minImgHeight,
    minImgWidth,
    imgSelected,
  ]);

  return (
    <>
      <Popup
        title={title}
        message={message}
        visible={visible}
        onVisibleChange={onVisibleChange}
        backgroundOpacity={backgroundOpacity}
        button={button}
        buttonText={buttonText}
        width={width}
        confirmCondition={() =>
          file != null && confirmCondition({ file: file })
        }
        onButtonClick={(btn) => {
          if (btn === "confirm" && onSubmit) {
            onSubmit({ file: file });
            refresh();
          } else if (btn === "cancel" && onCancel) {
            onCancel();
            refresh();
          }
        }}
      >
        <img
          src={img}
          alt="preview upload"
          className={cx("upload-preview")}
          onLoad={(_) => setError(false)}
          onError={(_) => setError(true)}
          hidden={error}
        ></img>
        <div className={cx("filebox")}>
          <input
            className={cx("input", "upload-input")}
            value={file ? file.name : ""}
            readOnly
            placeholder="첨부파일"
          />
          <div className={cx("upload-button-wrapper")}>
            <button
              className={cx("upload-button")}
              onClick={() => inputRef.current?.click()}
            >
              찾기
            </button>
            {deleteBtn ? (
              <button
                className={cx("upload-button")}
                onClick={() => onDelete()}
              >
                삭제
              </button>
            ) : undefined}
          </div>
          <input
            ref={inputRef}
            type="file"
            id="file"
            accept={acceptExts ? acceptExts : ""}
            onChange={(e) => {
              if (e.target.files) setFile(e.target.files[0]);

              if (e.target.files && e.target.files[0]) {
                if (limitFileSize && e.target.files[0].size > limitFileSize) {
                  if (onError)
                    onError(
                      `파일의 크기는 ${stringifyByte(
                        limitFileSize
                      )}을 넘을 수 없습니다.`
                    );
                  e.target.files = null;
                  setFile(null);
                  setError(true);
                  return;
                }

                const reader = new FileReader();

                reader.onload = (e) => {
                  setImg(e.target?.result);
                  setImgSelected(true);
                };

                reader.readAsDataURL(e.target.files[0]);
              }
            }}
          />
        </div>
      </Popup>
      <img ref={imgRef} style={{ display: "none" }} alt="New profile"></img>
    </>
  );
};

export default UploadFilePopup;
