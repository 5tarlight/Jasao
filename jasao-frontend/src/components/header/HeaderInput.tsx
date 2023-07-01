import styles from "../../styles/header/Header.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export default function HeaderInput() {
  return (
    <div className={cx("vertical-aligner")}>
      <div className={cx("header-input-container")}>
        <input className={cx("header-input")} placeholder="검색" />
        <button className={cx("search-btn")}>검색</button>
      </div>
    </div>
  );
}
