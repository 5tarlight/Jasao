import { FC, useState } from "react";
import styles from "../../styles/profile/Profile.module.scss";
import classNames from "classnames/bind";
import ProfileImage from "../ProfileImage";
import { User } from "../../pages/profile/ViewProfile";
import EditableText from "../EditableText";
import InputPopup from "../popup/Input";
import { validate } from "../../util/auth";
import { getStorage } from "../../util/storage";
import { getServer, request } from "../../util/server";

const cx = classNames.bind(styles);

export type UserActionType =
  | "edit-profile"
  | "follow"
  | "unfollow"
  | "add-friend"
  | "remove-friend"
  | "block";

interface Props {
  user: User;
  isMine: boolean;
  action: (type: UserActionType) => void;
}

const UserInformation: FC<Props> = ({ user, isMine, action }) => {
  const [popup, setPopup] = useState(false);
  const [temp, setTemp] = useState("");
  const [username, setUsername] = useState(user.data.username);
  const isFriend = false;
  const isFollowed = false;

  const edit = (value: string) => {
    if (user.data.username === value) {
      return;
    }

    setTemp(value);
    setPopup(true);
  };

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
        {/* <div className={cx("info-username")}>{user.data.username}</div> */}
        <EditableText
          className={cx("info-username")}
          value={username}
          onChange={setUsername}
          onEdit={edit}
          editable={isMine}
          multiline
        />
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
      <div
        className={cx("info-button-container", [
          { "info-button-container-center": isMine },
        ])}
      >
        {isMine ? (
          <button
            className={cx("info-button", "info-button-1")}
            hidden={!isMine}
            onClick={() => action("edit-profile")}
          >
            프로필 수정
          </button>
        ) : (
          <>
            <button
              className={cx("info-button", "info-button-2")}
              hidden={isMine}
              onClick={() => action(isFollowed ? "unfollow" : "follow")}
            >
              {isFollowed ? "언팔로우" : "팔로우"}
            </button>
            <button
              className={cx("info-button", "info-button-2")}
              hidden={isMine}
              onClick={() => action(isFriend ? "remove-friend" : "add-friend")}
            >
              {isFriend ? "친구 삭제" : "친구 추가"}
            </button>
          </>
        )}
      </div>
      {!isMine ? (
        <div className={cx("info-block")} onClick={() => action("block")}>
          차단
        </div>
      ) : undefined}
      <InputPopup
        title="비밀번호를 입력하세요."
        visible={popup}
        setVisible={setPopup}
        condition={(value) => validate("password", value)}
        inputType="password"
        onInput={(password) => {
          const storage = getStorage();

          request(
            "patch",
            `${getServer()}/user/auth/update`,
            {
              oldPassword: password,
              username: temp,
            },
            {
              Authorization: storage?.login?.jwt,
            }
          )
            .then(() => {
              user.data.username = temp;
            })
            .catch(() => {
              window.confirm("닉네임 변경 오류");
            });
        }}
        onCancel={() => setUsername(user.data.username)}
      />
    </div>
  );
};

export default UserInformation;
