import { FC } from "react";
import styles from "../../styles/header/Header.module.scss";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

interface Props {
  text: string;
  to: string;
  pos?: "top" | "bottom" | "middle";
  border: boolean;
  accent?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const HeaderDropdownItem: FC<Props> = ({
  text,
  to,
  pos = "middle",
  border,
  accent = false,
  onClick,
}) => {
  return (
    <Link to={to}>
      <div
        className={cx("dropdown-item", [
          { "dropdown-border": border, "dropdown-accent": accent },
        ])}
        onClick={onClick}
      >
        {text}
      </div>
    </Link>
  );
};

export default HeaderDropdownItem;
