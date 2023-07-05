import styles from "../../styles/header/Header.module.scss";
import classNames from "classnames/bind";
import HeaderInput from "./HeaderInput";
import HeaderLogo from "./HeaderLogo";
import { useEffect, useState } from "react";
import { getStorage } from "../../util/storage";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

export default function Header() {
  const [login, setLogin] = useState(false);

  useEffect(() => {
    const storage = getStorage();
    setLogin((storage && storage.user && storage.user.login) || false);
  }, []);

  return (
    <header className={cx("header")}>
      <div className={cx("header-content")}>
        <div>
          <HeaderLogo />
        </div>
        <div>
          <HeaderInput />
        </div>
        {login ? <div>Welcome</div> : <Link to={"/login"}>로그인</Link>}
      </div>
    </header>
  );
}
