import styles from "../../styles/header/Header.module.scss";
import classNames from "classnames/bind";
import HeaderInput from "./HeaderInput";
import HeaderLogo from "./HeaderLogo";
import { useEffect, useState } from "react";
import { getStorage, saveStorage } from "../../util/storage";
import HeaderLogin from "./HeaderLogin";
import axios from "axios";
import { getServer } from "../../util/server";

const cx = classNames.bind(styles);

interface RefreshRes {
  message: string;
  data: {
    token: string;
  } | null;
}

export default function Header() {
  const [login, setLogin] = useState(false);

  useEffect(() => {
    const storage = getStorage();

    if (!storage) {
      return;
    }

    axios
      .post<RefreshRes>(
        `${getServer()}/user/refresh`,
        {},
        {
          headers: {
            Authorization: storage.login?.jwt,
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.data) {
          saveStorage({
            ...storage,
            login: {
              jwt: res.data.data.token,
              login: true,
            },
          });
          setLogin(true);
        } else {
          saveStorage({
            ...storage,
            login: undefined,
            user: undefined,
          });
        }
      })
      .catch(() => {
        setLogin(false);
        saveStorage({
          ...storage,
          login: undefined,
          user: undefined,
        });
      });

    // setLogin((storage && storage.login && storage.login.login) || false);
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
