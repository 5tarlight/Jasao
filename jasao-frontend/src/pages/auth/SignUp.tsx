import { Link } from "react-router-dom";
import styles from "../../styles/auth/auth.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export default function SignUp() {
  return (
    <div className={cx("aligner")}>
      <div className={cx("container")}>
        <div className={cx("title-container")}>
          <h2 className={cx("title")}>회원가입</h2>
          <nav className={cx("subtitle")}>Jasao 계정 생성</nav>
        </div>

        <div className={cx("input-container")}>
          <input className={cx("input")} placeholder="이메일" type="email" />
          <input className={cx("input")} placeholder="이름" type="text" />
          <input
            className={cx("input")}
            placeholder="비밀번호"
            type="password"
          />
          <input
            className={cx("input")}
            placeholder="비밀번호 확인"
            type="password"
          />
          {/* <div className={cx("unable")}>
            <Link to={"/auth/find"}>로그인할 수 없습니다.</Link>
          </div> */}
          <div className={cx("btn-container")}>
            <button>회원가입</button>
          </div>
        </div>
        <div className={cx("menu-container")}>
          <Link to={"/auth/login"}>계정이 이미 있습니다.</Link>
        </div>
      </div>
    </div>
  );
}
