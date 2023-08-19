import { FC, useCallback, useEffect, useState } from "react";
import styles from "../../styles/profile/Profile.module.scss";
import classNames from "classnames/bind";
import ProfileImage from "../ProfileImage";
import EditableText from "../EditableText";
import { followUser, unfollowUser, validate } from "../../util/auth";
import { getStorage } from "../../util/storage";
import { getServer, request } from "../../util/server";
import { User } from "../../util/user";
import Popup from "../popup/Popup";

const cx = classNames.bind(styles);

type UserActionType =
  | "edit-profile"
  | "follow"
  | "unfollow"
  | "add-friend"
  | "remove-friend"
  | "block";

interface FollowRes {
  message: string;
  data: number[];
}

interface Props {
  user: User;
  isMine: boolean;
  myId: number | undefined;
  // action: (type: UserActionType) => void;
}

const UserInformation: FC<Props> = ({ user, isMine, myId }) => {
  const [popup, setPopup] = useState(false);
  const [temp, setTemp] = useState("");
  const [username, setUsername] = useState(user.username);
  const [isFriend, setIsFriend] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [followed, setFollowed] = useState<number[]>([]);
  const [following, setFollowing] = useState<number[]>([]);
  const [friend, setFriend] = useState(0);

  const action = (type: UserActionType) => {
    switch (type) {
      case "add-friend":
        break;

      case "follow":
        if (!isFollowed) {
          followUser(user.id)
            .then(() => {
              refreshFollowedList();
            })
            .catch((reason) => window.confirm(`팔로우 실패 ${reason}`));
        }
        break;

      case "unfollow":
        if (isFollowed) {
          unfollowUser(user.id)
            .then(() => {
              refreshFollowedList();
            })
            .catch((reason) => window.confirm(`언팔 실패 ${reason}`));
        }
        break;

      case "edit-profile":
        break;

      case "block":
        break;
    }
  };

  const refreshFollowedList = useCallback(() => {
    request<FollowRes>("get", `${getServer()}/users/followed?id=${user.id}`, {})
      .then((res) => {
        setFollowed(res.data.data);
      })
      .catch(() => console.log(`failed get followed: user/${user.id}`));
  }, [user.id]);

  useEffect(() => {
    refreshFollowedList();
  }, [setFollowed, user.id, refreshFollowedList]);

  useEffect(() => {
    request<FollowRes>(
      "get",
      `${getServer()}/users/following?id=${user.id}`,
      {}
    )
      .then((res) => setFollowing(res.data.data))
      .catch(() => console.log(`failed get following: user/${user.id}`));
  }, [setFollowing, user.id]);

  useEffect(() => {
    if (myId) setIsFollowed(followed.includes(myId));
  }, [followed, myId]);

  const edit = (value: string) => {
    if (user.username === value) {
      return;
    }

    setTemp(value);
    setPopup(true);
  };

  return (
    <div className={cx("info-container")}>
      <ProfileImage
        image={user.profile}
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
        />
        <div className={cx("info-value-container")}>
          <div>{friend} 친구</div>
          <div>{following.length} 팔로잉</div>
          <div>{followed.length} 팔로워</div>
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
      <Popup
        type="input"
        title="비밀번호를 입력하세요."
        visible={popup}
        onVisibleChange={setPopup}
        confirmCondition={(value) => validate("password", value)}
        inputType="password"
        onClose={(e) => {
          if (e.button === "confirm") {
            const storage = getStorage();

            request(
              "patch",
              `${getServer()}/user/auth/update`,
              {
                oldPassword: e.value,
                username: temp,
              },
              {
                Authorization: storage?.login?.jwt,
              }
            )
              .then(() => {
                user.username = temp;
              })
              .catch(() => {
                window.confirm("닉네임 변경 오류");
                setUsername(user.username);
              });
          } else {
            setUsername(user.username);
          }
        }}
      />
    </div>
  );
};

export default UserInformation;
