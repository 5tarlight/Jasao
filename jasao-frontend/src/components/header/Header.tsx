import styles from "../../styles/header/Header.module.scss";
import classNames from "classnames/bind";
import HeaderInput from "./HeaderInput";
import HeaderLogo from "./HeaderLogo";
import { useEffect, useState } from "react";
import { getStorage } from "../../util/storage";
import HeaderLogin from "./HeaderLogin";

const cx = classNames.bind(styles);

export default function Header() {
  const [login, setLogin] = useState(false);

  useEffect(() => {
    const storage = getStorage();
    setLogin((storage && storage.login && storage.login.login) || false);
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
        {login ? <div>Welcome</div> : <HeaderLogin />}
      </div>
    </header>
  );
}
