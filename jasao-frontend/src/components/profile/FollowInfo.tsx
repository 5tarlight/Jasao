import { FC, useState } from "react";
import styles from "../../styles/profile/FollowInfo.module.scss";
import classNames from "classnames/bind";
import TabPage from "../TabPage";

const cx = classNames.bind(styles);

const FollowInfo: FC = () => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <>
      <TabPage
        tabName={["팔로워", "팔로잉"]}
        tabIndex={tabIndex}
        onTabIndexChange={setTabIndex}
      >
        <div>tab 1</div>
        <div>tab 2</div>
      </TabPage>
    </>
  );
};

export default FollowInfo;
