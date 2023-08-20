import { FC, useState, useRef } from "react";
import styles from "../../styles/header/Header.module.scss";
import classNames from "classnames/bind";
import HeaderDropdown from "./HeaderDropdown";
import ProfileImage from "../profile/ProfileImage";

const cx = classNames.bind(styles);

interface Props {
  username: string;
  id: number;
  image: string | null;
}

const LoginHeader: FC<Props> = ({ id, username, image }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  return (
    <div
      ref={dropdownRef}
      tabIndex={-1}
      onClick={() => setDropdownVisible(!dropdownVisible)}
      onBlur={(e) => {
        if (!dropdownRef.current?.contains(e.relatedTarget)) {
          setDropdownVisible(false);
        }
      }}
      className={cx("profile-container")}
    >
      <div className={cx("profile-username")}>
        <ProfileImage image={image} size={45} />
        <div className={cx("profile-username-text")}>
          {username.length > 20 ? username.slice(17) + "..." : username}
        </div>
      </div>
      <svg className={cx("triangle")}>
        <polygon points="10,5 0,5 5,14" fill="black" />
      </svg>
      <HeaderDropdown
        id={id}
        visible={dropdownVisible}
        setVisible={setDropdownVisible}
      ></HeaderDropdown>
    </div>
  );
};

export default LoginHeader;
