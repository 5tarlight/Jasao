import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/auth/auth.module.scss";
import classNames from "classnames/bind";
import { useState } from "react";
import { getServer, request } from "../../util/server";

const cx = classNames.bind(styles);

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [warn, setWarn] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    const emailRe = new RegExp("^[\\w]+@([\\w-\\.]+\\.)+[\\w]{2,4}$");
    const usernameRe = new RegExp("[\\w|ㄱ-ㅎ가-힣]");
    const passwordRe = new RegExp(
      "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\\-=])(?=.{8,})"
    );

    if (email.trim().length === 0) {
      setWarn("이메일을 입력하세요.");
      return;
    } else if (!emailRe.test(email)) {
      setWarn("이메일 형식이 아닙니다.");
      return;
    } else if (email.length > 100) {
      setWarn("이메일이 너무 길어요.");
      return;
    }

    if (username.trim().length === 0) {
      setWarn("이름을 입력하세요.");
      return;
    } else if (
      username.length < 2 ||
      username.length > 20 ||
      !usernameRe.test(username)
    ) {
      setWarn("이름은 2~20자의 영문 대/소문자, 한글, 숫자, _ 를 사용하세요.");
      return;
    }

    if (password.trim().length === 0) {
      setWarn("비밀번호를 입력하세요.");
      return;
    } else if (password.length < 8) {
      setWarn("비밀번호는 8자 이상이어야 합니다.");
      return;
    } else if (password.length > 255) {
      setWarn("비밀번호가 너무 길다.");
      return;
    } else if (!passwordRe.test(password)) {
      setWarn(
        "비밀번호는 영문 대/소문자, 숫자, 특수문자(!@#$%^&*()-=)를 포함해야 합니다."
      );
      return;
    }

    if (password !== confirm) {
      setWarn("비밀번호가 일치하지 않습니다.");
      return;
    }

    request("post", `${getServer()}/user/signup`, {
      email,
      username,
      password,
    })
      .then(() => {
        navigate("/auth/login");
      })
      .catch(() => {
        setWarn("이미 사용중인 이름이나 이메일입니다.");
      });
  };

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
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
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
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
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
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
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
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
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
