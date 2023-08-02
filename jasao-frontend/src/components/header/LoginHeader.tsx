import { FC } from "react";
import styles from "../../styles/header/Header.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

interface Props {
  username: string;
  id: number;
}

const LoginHeader: FC<Props> = ({ id, username }) => {
  return (
    <div className={cx("profile-container")}>
      <div className={cx("profile-username")}>
        {username.length > 20 ? username.slice(17) + "..." : username}
      </div>
    </div>
  );
};

export default LoginHeader;
