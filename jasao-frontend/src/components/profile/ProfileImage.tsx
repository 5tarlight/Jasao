import { FC } from "react";
import styles from "../../styles/profile/Profile.module.scss";
import classNames from "classnames/bind";
import { getCdn } from "../../util/server";

const cx = classNames.bind(styles);

interface Props {
  image: string | null | undefined;
  size: number | string;
  style?: React.CSSProperties;
}

const ProfileImage: FC<Props> = ({ image, size, style }) => {
  return (
    <div className={cx("image-container")}>
      <img
        className={cx("image")}
        // width={size}
        // height={size}
        src={image ? `${getCdn()}${image}` : "/person.svg"}
        alt="Profile"
        style={{ ...style, width: size, height: size }}
        onError={(e) => (e.currentTarget.src = "/person.svg")}
      />
    </div>
  );
};

export default ProfileImage;
