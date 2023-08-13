import { FC } from "react";
import styles from "../styles/ProfileImage.module.scss";
import classNames from "classnames/bind";
import { getCdn } from "../util/server";

const cx = classNames.bind(styles);

interface Props {
  image: string | null;
  size: number;
}

const ProfileImage: FC<Props> = ({ image, size }) => {
  return (
    <div className={cx("container")}>
      {image ? (
        <img
          className={cx("image")}
          width={size}
          height={size}
          src={`${getCdn()}${image}`}
        ></img>
      ) : (
        <img
          className={cx("image")}
          width={size}
          height={size}
          src="/person.svg"
        ></img>
      )}
    </div>
  );
};

export default ProfileImage;
