import { Link } from "react-router-dom";
import styles from "../../styles/header/Header.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export default function HeaderLogin() {
  return (
    <div>
      <Link to={"/auth/login"}>
        <button className={cx("login-btn")}>로그인</button>
      </Link>
    </div>
  );
}
