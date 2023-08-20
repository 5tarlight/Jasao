import { FC, useEffect, useState } from "react";
import styles from "../../styles/profile/Profile.module.scss";
import classNames from "classnames/bind";
import { useNavigate, useParams } from "react-router-dom";
import UserInfo from "../../components/profile/UserInfo";
import { getServer, request } from "../../util/server";
import { getStorage } from "../../util/storage";
import { isNumeric } from "../../util/utilities";
import { User, UserRes } from "../../util/user";
import FollowInfo from "../../components/profile/FollowInfo";

const cx = classNames.bind(styles);

const ViewProfile: FC = () => {
  const targetId = isNumeric(useParams().id, -1);
  const nav = useNavigate();
  const [userData, setUserData] = useState<User>();
  const [myId, setMyId] = useState<number>();

  const isMine = () => myId === targetId;

  useEffect(() => {
    const storage = getStorage();
    setMyId(storage?.user?.id);

    request<UserRes>("get", `${getServer()}/user/id?id=${targetId}`, {})
      .then((res) => {
        setUserData(res.data.data);
      })
      .catch(() => {
        nav("/404");
      });
  }, [targetId, nav]);

  return (
    <>
      {userData ? (
        <div className={cx("contatiner")}>
          <div className={cx("info")}>
            <UserInfo user={userData} isMine={isMine()} myId={myId} />
          </div>
          <div className={cx("content")}>
            <FollowInfo />
          </div>
        </div>
      ) : undefined}
    </>
  );
};

export default ViewProfile;
