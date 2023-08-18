import { FC } from "react";
import styles from "../../styles/profile/Profile.module.scss";
import classNames from "classnames/bind";
import ProfileImage from "../ProfileImage";
import { User } from "../../pages/profile/ViewProfile";

const cx = classNames.bind(styles);

export type UserActionType = "edit-profile" | "follow" | "add-friend" | "block";

interface Props {
  user: User;
  isMine: boolean;
  action: (type: UserActionType) => void;
}

const UserInformation: FC<Props> = ({ user, isMine, action }) => {
  return (
    <div className={cx("info-container")}>
      <ProfileImage
        image={user.data.profile}
        size={16.5 * 16}
        style={{
          borderWidth: 2,
          borderStyle: "solid",
          borderColor: "#777777",
        }}
      ></ProfileImage>
      <div className={cx("info-text-container")}>
        <div className={cx("info-username")}>{user.data.username}</div>
        <div className={cx("info-value-container")}>
          <div>123 친구</div>
          <div>456 팔로잉</div>
          <div>789 팔로워</div>
        </div>
        <div className={cx("info-value-container")}>
          <div>124 카페 가입</div>
          <div>562 카페 소유</div>
        </div>
        <div className={cx("info-value-container")}>
          <div>5125 게시글</div>
          <div>124 댓글</div>
        </div>
      </div>
      <div className={cx("info-value-container")}>
        <button
          className={cx("info-button", "info-button-1")}
          hidden={!isMine}
          onClick={() => action("edit-profile")}
        >
          프로필 수정
        </button>
        <button
          className={cx("info-button", "info-button-2")}
          hidden={isMine}
          onClick={() => action("follow")}
        >
          팔로우
        </button>
        <button
          className={cx("info-button", "info-button-2")}
          hidden={isMine}
          onClick={() => action("add-friend")}
        >
          친구 추가
        </button>
      </div>
      <div
        className={cx("info-block")}
        hidden={isMine}
        onClick={() => action("block")}
      >
        차단
      </div>
    </div>
  );
};

export default UserInformation;
