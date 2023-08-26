import { FC, useCallback, useEffect, useState } from "react";
import styles from "../../styles/profile/Profile.module.scss";
import classNames from "classnames/bind";
import ProfileImage from "./ProfileImage";
import EditableText from "../EditableText";
import { validate } from "../../util/auth";
import { getStorage } from "../../util/storage";
import { getServer, request, requestWithLogin } from "../../util/server";
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
  data: {
    page: number;
    maxPage: number;
    count: number;
    payload: {
      id: number;
      username: string;
      profile: string;
      bio: string;
    }[];
  };
}

interface Props {
  user: User;
  isMine: boolean;
  myId: number | undefined;
}

const UserInfo: FC<Props> = ({ user, isMine, myId }) => {
  const [popup, setPopup] = useState(false);
  const [temp, setTemp] = useState("");
  const [username, setUsername] = useState(user.username);
  const [isFriend, setIsFriend] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [followed, setFollowed] = useState<number>(0);
  const [following, setFollowing] = useState<number>(0);
  const [friend, setFriend] = useState(0);

  const action = (type: UserActionType) => {
    switch (type) {
      case "add-friend":
        break;

      case "follow":
        if (!isFollowed) {
          const storage = getStorage();

          requestWithLogin("post", `users/auth/follow`, {
            target: user.id,
          })
            .then(() => refreshFollowList("followed"))
            .catch((reason) => console.log(reason));
        }
        break;

      case "unfollow":
        if (isFollowed) {
          const storage = getStorage();

          requestWithLogin("post", `users/auth/unfollow`, {
            target: user.id,
          })
            .then(() => refreshFollowList("followed"))
            .catch((reason) => console.log(reason));
        }
        break;

      case "edit-profile":
        break;

      case "block":
        break;
    }
  };

  const refreshFollowList = useCallback(
    (type: "followed" | "following") => {
      request<FollowRes>(
        "get",
        `${getServer()}/users/${type}?id=${user.id}`,
        {}
      )
        .then((res) => {
          if (type === "followed") setFollowed(res.data.data.count);
          else setFollowing(res.data.data.count);
        })
        .catch(() => console.log(`failed get ${type}: user/${user.id}`));
    },
    [user.id]
  );

  useEffect(() => {
    refreshFollowList("followed");
  }, [setFollowed, user.id, refreshFollowList]);

  useEffect(() => {
    refreshFollowList("following");
  }, [setFollowing, user, refreshFollowList]);

  useEffect(() => {
    requestWithLogin<boolean>(
      "get",
      `users/auth/isfollow?target=${user.id}`,
      {}
    )
      .then((r) => setIsFollowed(r))
      .catch((reason) => console.log(reason));
  }, [user.id, setIsFollowed, followed]);

  useEffect(() => {
    setUsername(user.username);
  }, [user]);

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
        size={15 * 16}
        style={{
          borderWidth: 2,
          borderStyle: "solid",
          borderColor: "#777777",
        }}
      ></ProfileImage>
      <div className={cx("info-text-container")}>
        <EditableText
          className={cx("info-username")}
          value={username}
          onChange={setUsername}
          onEdit={edit}
          editable={isMine}
        />
        <div className={cx("info-value-container")}>
          <div>{friend} 친구</div>
          <div>{following} 팔로잉</div>
          <div>{followed} 팔로워</div>
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

export default UserInfo;
