import { Link } from "react-router-dom";
import styles from "../../styles/auth/auth.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export default function Login() {
  return (
    <div className={cx("aligner")}>
      <div className={cx("container")}>
        <div className={cx("title-container")}>
          <h2 className={cx("title")}>로그인</h2>
          <nav className={cx("subtitle")}>Jasao 계정으로 로그인</nav>
        </div>

        <div className={cx("input-container")}>
          <input className={cx("input")} placeholder="이메일" type="email" />
          <input
            className={cx("input")}
            placeholder="비밀번호"
            type="password"
          />
          <div className={cx("unable")}>
            <Link to={"/auth/find"}>로그인할 수 없습니다.</Link>
          </div>
          <div className={cx("btn-container")}>
            <button>로그인</button>
          </div>
        </div>
        <div className={cx("menu-container")}>
          <Link to={"/auth/signup"}>계정이 없습니다.</Link>
        </div>
      </div>
    </div>
  );
}
