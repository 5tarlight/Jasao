import { Link } from "react-router-dom";
import styles from "../../styles/auth/auth.module.scss";
import classNames from "classnames/bind";
import { useState } from "react";
import { getServer, request } from "../../util/server";
import { Memory, getStorage, saveStorage } from "../../util/storage";
import { validate } from "../../util/auth";

const cx = classNames.bind(styles);

interface LoginRes {
  message: string;
  data:
    | {
        id: number;
        email: string;
        username: string;
        role: string;
        token: string;
        profile: string;
        bio: string;
      }
    | undefined;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [warn, setWarn] = useState("");

  const handleLogin = () => {
    if (!validate("email", email) || !validate("password", password)) {
      setWarn("로그인할 수 없습니다.");
      return;
    }

    request<LoginRes>("post", `${getServer()}/user/login`, { email, password })
      .then((res) => {
        const userData = res.data.data;

        saveStorage({
          ...getStorage(),
          user: userData,
          login: {
            login: true,
            jwt: userData?.token,
            refresh: "",
          },
        } as Memory);

        window.location.replace("/");
      })
      .catch((err) => {
        setWarn("로그인할 수 없습니다.");
      });
  };

  return (
    <div className={cx("aligner")}>
      <div className={cx("container")}>
        <div className={cx("title-container")}>
          <h2 className={cx("title")}>로그인</h2>
          <nav className={cx("subtitle")}>Jasao 계정으로 로그인</nav>
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
              if (e.key === "Enter") handleLogin();
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
              if (e.key === "Enter") handleLogin();
            }}
          />
          <div className={cx("unable")}>
            <Link to={"/auth/problem"}>로그인할 수 없나요?</Link>
          </div>
          <div className={cx("error-msg")}>{warn}</div>
          <div className={cx("btn-container")}>
            <button onClick={handleLogin}>로그인</button>
          </div>
        </div>
        <div className={cx("menu-container")}>
          <Link to={"/auth/signup"}>계정이 없으신가요?</Link>
        </div>
      </div>
    </div>
  );
}
