import { Children, FC, useEffect, useState } from "react";
import styles from "../styles/TabPage.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

interface Props {
  children?: React.ReactNode;
  tabIndex?: number;
  tabName?: string[];
  onTabIndexChange?: (value: number) => void;
}

const TabPage: FC<Props> = ({ children, tabName, tabIndex = 0 }) => {
  const [index, setIndex] = useState(tabIndex);

  useEffect(() => {
    setIndex(tabIndex);
  }, [setIndex, tabIndex]);

  return (
    <div className={cx("tabpage")}>
      <div className={cx("tabpage-tab")}>
        {Children.map(children, (child, i) =>
          tabName ? (
            tabName.length > i ? (
              <div
                className={cx("tabpage-tab-item", [
                  { "tabpage-tab-item-enable": index === i },
                ])}
                onClick={() => {
                  if (index !== i) setIndex(i);
                }}
              >
                {tabName[i]}
              </div>
            ) : (
              ""
            )
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
