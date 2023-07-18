import { Link } from "react-router-dom";
import styles from "../../styles/auth/auth.module.scss";
import classNames from "classnames/bind";
import { useState } from "react";

const cx = classNames.bind(styles);

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [warn, setWarn] = useState("");

  const handleSubmit = () => {};

  return (
    <div className={cx("aligner")}>
      <div className={cx("container")}>
        <div className={cx("title-container")}>
          <h2 className={cx("title")}>회원가입</h2>
          <nav className={cx("subtitle")}>Jasao 계정 생성</nav>
        </div>

        <div className={cx("input-container")}>
          <input
            className={cx("input")}
            placeholder="이메일"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            className={cx("input")}
            placeholder="이름"
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <input
            className={cx("input")}
            placeholder="비밀번호"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <input
            className={cx("input")}
            placeholder="비밀번호 확인"
            type="password"
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
            }}
          />
          <div className={cx("error-msg")}>{warn}</div>
          <div className={cx("btn-container")}>
            <button onClick={handleSubmit}>회원가입</button>
          </div>
        </div>
        <div className={cx("menu-container")}>
          <Link to={"/auth/login"}>계정이 이미 있으신가요?</Link>
        </div>
      </div>
    </div>
  );
}
