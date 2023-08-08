import { FC, useEffect, useState, useRef } from "react";
import styles from "../../styles/header/Header.module.scss";
import classNames from "classnames/bind";
import HeaderDropdownItem from "./HeaderDropdownItem";

const cx = classNames.bind(styles);

interface Props {
  id: number;
  visible: boolean;
  setVisible: (value: boolean) => void;
}

interface Item {
  text: string;
  to: string;
  accent?: boolean;
}

type DropdownItem = Item | "sep";

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

  const itemToRender = (key: number, item: DropdownItem, border: boolean) => {
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
          itemToRender(
            i,
            item,
            items[i + 1] !== "sep" && items.length - 1 !== i
          )
        )}
      </>
    );
  }, []);

  return (
    <div
      className={cx("dropdown-container", [{ "dropdown-visible": visible }])}
    >
      {renderItems}
    </div>
  );
};

export default HeaderDropdown;
