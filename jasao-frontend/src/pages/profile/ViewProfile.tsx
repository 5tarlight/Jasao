import { FC, useEffect, useState } from "react";
import styles from "../../styles/profile/Profile.module.scss";
import classNames from "classnames/bind";
import { useNavigate, useParams } from "react-router-dom";
import UserInformation, {
  UserActionType,
} from "../../components/profile/UserInformation";
import { getServer, request } from "../../util/server";

const cx = classNames.bind(styles);

export interface User {
  message: string;
  data: {
    bio: string;
    email: string;
    id: number;
    profile: string | null;
    role: string;
    username: string;
  };
}

const ViewProfile: FC = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [userData, setUserData] = useState<User>();

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
    request<User>("get", `${getServer()}/user/id?id=${id}`, {})
      .then((res) => {
        setUserData(res.data);
      })
      .catch((reason) => {
        nav("/404");
      });
  }, []);

  return (
    <>
      {userData ? (
        <div className={cx("contatiner")}>
          <div className={cx("info")}>
            <UserInformation
              user={userData}
              isMine={false}
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
