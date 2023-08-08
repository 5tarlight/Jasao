import { FC, useState, useRef } from "react";
import styles from "../../styles/header/Header.module.scss";
import classNames from "classnames/bind";
import HeaderDropdown from "./HeaderDropdown";
import HeaderDropdownItem from "./HeaderDropdownItem";

const cx = classNames.bind(styles);

interface Props {
  username: string;
  id: number;
}

const LoginHeader: FC<Props> = ({ id, username }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  return (
    <div
      ref={dropdownRef}
      tabIndex={-1}
      onBlur={(e) => {
        if (!dropdownRef.current?.contains(e.relatedTarget)) {
          setDropdownVisible(false);
        }
      }}
      className={cx("profile-container")}
    >
      <div
        className={cx("profile-username")}
        onClick={() => setDropdownVisible(!dropdownVisible)}
      >
        {username.length > 20 ? username.slice(17) + "..." : username}
      </div>
      <HeaderDropdown
        id={id}
        visible={dropdownVisible}
        setVisible={setDropdownVisible}
      ></HeaderDropdown>
    </div>
  );
};

export default LoginHeader;
