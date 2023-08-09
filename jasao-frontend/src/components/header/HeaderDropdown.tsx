import { FC, useEffect, useState } from "react";
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
  const [renderItems, setRenderItems] = useState<JSX.Element>();

  const items: DropdownItem[] = [
    { text: "Profile", to: "/" },
    "sep",
    { text: "Joined cafes", to: "/" },
    { text: "Owned cafes", to: "/" },
    "sep",
    { text: "Settings", to: "/" },
    { text: "Logout", to: "/auth/logout", accent: true },
  ];

  const getElement = (key: number, item: DropdownItem, border: boolean) => {
    return item === "sep" ? (
      <hr key={key} className={cx("dropdown-sep")}></hr>
    ) : (
      <HeaderDropdownItem
        key={key}
        text={item.text}
        to={item.to}
        border={border}
        accent={item.accent}
        onClick={() => setVisible(false)}
      ></HeaderDropdownItem>
    );
  };

  useEffect(() => {
    setRenderItems(
      <>
        {items.map((item, i) =>
          getElement(i, item, items[i + 1] !== "sep" && items.length - 1 !== i)
        )}
      </>
    );
  }, [items]);

  return (
    <div
      className={cx("dropdown-container", [{ "dropdown-visible": visible }])}
    >
      {renderItems}
    </div>
  );
};

export default HeaderDropdown;
