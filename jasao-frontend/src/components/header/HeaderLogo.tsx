import { Link } from "react-router-dom";
import styles from "../../styles/header/Header.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export default function HeaderLogo() {
  return (
    <h1 className={cx("logo")}>
      <Link to="/" className={cx("logo-text")}>
        Jasao
      </Link>
    </h1>
  );
}
