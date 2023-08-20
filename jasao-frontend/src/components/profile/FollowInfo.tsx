import { FC } from "react";
// import styles from "../../styles/profile/FollowInfo.module.scss";
// import classNames from "classnames/bind";
import TabPage from "../TabPage";
import FollowList from "./FollowList";

// const cx = classNames.bind(styles);

interface Props {
  targetId: number;
}

const FollowInfo: FC<Props> = ({ targetId }) => {
  // const [tabIndex, setTabIndex] = useState(0);

  return (
    <>
      <TabPage tabName={["팔로워", "팔로잉"]}>
        <FollowList targetId={targetId} type="followed" />
        <FollowList targetId={targetId} type="following" />
      </TabPage>
    </>
  );
};

export default FollowInfo;
