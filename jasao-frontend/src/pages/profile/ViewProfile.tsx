import { FC, useEffect, useState } from "react";
import styles from "../../styles/profile/Profile.module.scss";
import classNames from "classnames/bind";
import { useNavigate, useParams } from "react-router-dom";
import UserInformation, {
  UserActionType,
} from "../../components/profile/UserInformation";
import { getServer, request } from "../../util/server";
import { getStorage } from "../../util/storage";
import { isNumeric } from "../../util/utilities";

const cx = classNames.bind(styles);

interface UserRes {
  message: string;
  data: User;
}

export interface User {
  bio: string;
  email: string;
  id: number;
  profile: string | null;
  role: string;
  username: string;
}

const ViewProfile: FC = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [userData, setUserData] = useState<User>();
  const [isMine, setIsMine] = useState<boolean>();

  const userAction = (type: UserActionType) => {
    switch (type) {
      case "add-friend":
        break;

      case "follow":
        break;

      case "edit-profile":
        break;

      case "block":
        break;
    }
  };

  useEffect(() => {
    const storage = getStorage();
    const userId = isNumeric(id, -1);
    setIsMine(storage?.user?.id === userId);

    request<UserRes>("get", `${getServer()}/user/id?id=${userId}`, {})
      .then((res) => {
        setUserData(res.data.data);
      })
      .catch((reason) => {
        nav("/404");
      });
  }, [id, nav]);

  return (
    <>
      {userData && isMine !== undefined ? (
        <div className={cx("contatiner")}>
          <div className={cx("info")}>
            <UserInformation
              user={userData}
              isMine={isMine}
              action={userAction}
            />
          </div>
          <div className={cx("content")}></div>
        </div>
      ) : undefined}
    </>
  );
};

export default ViewProfile;
