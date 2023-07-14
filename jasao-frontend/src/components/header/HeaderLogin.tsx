import { Link } from "react-router-dom";
import styles from "../../styles/header/Header.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export default function HeaderLogin() {
  return (
    <div>
      <button className={cx("login-btn")}>
        <Link to={"/auth/login"}>로그인</Link>
      </button>
    </div>
  );
}
