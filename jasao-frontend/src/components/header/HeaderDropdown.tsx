import { FC } from "react";
import styles from "../../styles/header/Header.module.scss";
import classNames from "classnames/bind";
import HeaderDropdownItem from "./HeaderDropdownItem";

const cx = classNames.bind(styles);

interface Props {
  id: number;
  visible: boolean;
  setVisible: (value: boolean) => void;
}

interface Button {
  text: string;
  to: string;
  accent?: boolean;
}

type DropdownItem = Button | "sep";

const HeaderDropdown: FC<Props> = ({ id, visible, setVisible }) => {
  const items: DropdownItem[] = [
    { text: "Profile", to: `/profile/${id}` },
    "sep",
    { text: "Joined cafes", to: "/" },
    { text: "Owned cafes", to: "/" },
    "sep",
    { text: "Settings", to: "/" },
    { text: "Logout", to: "/auth/logout", accent: true },
  ];

  return (
    <div
      className={cx("dropdown-container", [{ "dropdown-visible": visible }])}
    >
      {items.map((item, i) =>
        // getElement(i, item, items[i + 1] !== "sep" && items.length - 1 !== i)
        item === "sep" ? (
          <hr key={i} className={cx("dropdown-sep")}></hr>
        ) : (
          <HeaderDropdownItem
            key={i}
            text={item.text}
            to={item.to}
            border={items[i + 1] !== "sep" && items.length - 1 !== i}
            accent={item.accent}
            onClick={() => setVisible(false)}
          ></HeaderDropdownItem>
        )
      )}
    </div>
  );
};

export default HeaderDropdown;
