import styles from "../../styles/header/Header.module.scss";
import classNames from "classnames/bind";
import HeaderInput from "./HeaderInput";
import HeaderLogo from "./HeaderLogo";
import { useEffect, useState } from "react";
import {
  Memory,
  UserMemory,
  getStorage,
  saveStorage,
} from "../../util/storage";
import HeaderLogin from "./HeaderLogin";
import axios from "axios";
import { getServer } from "../../util/server";
import LoginHeader from "./LoginHeader";

const cx = classNames.bind(styles);

interface RefreshRes {
  message: string;
  data: {
    token: string;
  } | null;
}

export default function Header() {
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState<UserMemory>();
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    let storage = getStorage();

    if (!storage || !storage.login?.login) {
      return;
    }

    const refresh = () => {
      storage = getStorage() as Memory;

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
            } as Memory);
            setLogin(true);
            setUser(getStorage()?.user!!);
          } else {
            saveStorage({
              ...storage,
              login: undefined,
              user: undefined,
            });
          }
          setImage(storage?.user?.profile!!);
        })
        .catch(() => {
          setLogin(false);
          saveStorage({
            ...storage,
            login: undefined,
            user: undefined,
          });
        });
    };

    refresh();

    const interval = setInterval(refresh, 20 * 60 * 1000); // 20m

    return () => clearInterval(interval);
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
        {login ? (
          <LoginHeader id={user?.id!!} username={user?.username!!} />
        ) : (
          <HeaderLogin />
        )}
      </div>
    </header>
  );
}
