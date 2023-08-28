import { Children, FC, useEffect, useState } from "react";
import styles from "../styles/TabPage.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

interface Props {
  children?: React.ReactNode;
  tabIndex?: number;
  tabName?: string[];
  onTabIndexChange?: (value: number) => void;
  width?: number | string;
  height?: number | string;
}

const TabPage: FC<Props> = ({
  children,
  tabName,
  tabIndex = 0,
  width,
  height,
}) => {
  const [index, setIndex] = useState(tabIndex);

  useEffect(() => {
    setIndex(tabIndex);
  }, [setIndex, tabIndex]);

  return (
    <div className={cx("tabpage")} style={{ width, height }}>
      <div className={cx("tabpage-tab")}>
        {Children.map(children, (child, i) =>
          tabName ? (
            <div
              className={cx("tabpage-tab-item", [
                { "tabpage-tab-item-enable": index === i },
              ])}
              onClick={() => {
                if (index !== i) setIndex(i);
              }}
            >
              {tabName.length > i ? tabName[i] : ""}
            </div>
          ) : (
            ""
          )
        )}
      </div>
      <div className={cx("tabpage-page")}>
        {Children.map(children, (child, i) =>
          i === index ? child : undefined
        )}
      </div>
    </div>
  );
};

export default TabPage;
