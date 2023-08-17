import { FC } from "react";
import styles from "../../styles/footer/Footer.module.scss";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

const Footer: FC<{}> = () => {
  const year = new Date().getFullYear();

  return (
    <footer className={cx("footer")}>
      <div className={cx("footer-content")}>
        <div>&copy; {year} Jasao All right reserved.</div>
        <div className="footer-links">
          <Link to="/" className={cx("footer-link")}>
            About
          </Link>
          <Link to="/" className={cx("footer-link")}>
            Term of Service
          </Link>
          <Link to="/" className={cx("footer-link")}>
            Privacy
          </Link>
          <Link to="/" className={cx("footer-link")}>
            Pricing
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
