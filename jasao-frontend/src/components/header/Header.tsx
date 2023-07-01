import styles from "../../styles/header/Header.module.scss";
import classNames from "classnames/bind";
import HeaderInput from "./HeaderInput";

const cx = classNames.bind(styles);

export default function Header() {
  return (
    <header className={cx("header")}>
      <div className={cx("header-content")}>
        <div>
          <h1>Jasao</h1>
        </div>
        <div>
          <HeaderInput />
        </div>
        <div>Login</div>
      </div>
    </header>
  );
}
