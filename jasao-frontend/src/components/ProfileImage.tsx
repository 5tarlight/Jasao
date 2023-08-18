import { FC } from "react";
import styles from "../styles/ProfileImage.module.scss";
import classNames from "classnames/bind";
import { getCdn } from "../util/server";

const cx = classNames.bind(styles);

interface Props {
  image: string | null | undefined;
  size: number | string;
  style?: React.CSSProperties;
}

const ProfileImage: FC<Props> = ({ image, size, style }) => {
  const getImg = (src: string) => {
    return (
      <img
        className={cx("image")}
        width={size}
        height={size}
        src={src}
        alt="Profile"
        style={style}
      ></img>
    );
  };

  return (
    <div className={cx("container")}>
      {image ? getImg(`${getCdn()}${image}`) : getImg("/person.svg")}
    </div>
  );
};

export default ProfileImage;
