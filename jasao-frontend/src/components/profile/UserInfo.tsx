import { FC, useCallback, useEffect, useState } from "react";
import styles from "../../styles/profile/Profile.module.scss";
import classNames from "classnames/bind";
import ProfileImage from "./ProfileImage";
import EditableText from "../EditableText";
import { imgLimit, validate } from "../../util/auth";
import { getStorage } from "../../util/storage";
import {
  getCdn,
  getServer,
  request,
  requestWithLogin,
} from "../../util/server";
import { User } from "../../util/user";
import Popup from "../popup/Popup";
import axios from "axios";

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
  const [uploadPopup, setUploadPopup] = useState(false);
  const [pwPopup, setPwPopup] = useState(false);
  const [temp, setTemp] = useState("");
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [isFollowed, setIsFollowed] = useState(false);
  const [followed, setFollowed] = useState<number>(0);
  const [following, setFollowing] = useState<number>(0);
  const [editType, setEditType] = useState<"username" | "bio">("username");

  const [messagePopup, setMessagePopup] = useState({
    visible: false,
    title: "",
    message: "",
  });

  const sendMessage = (title: string, message: string) => {
    setMessagePopup({
      title,
      message,
      visible: true,
    });
  };

  const action = (type: UserActionType) => {
    switch (type) {
      case "add-friend":
        break;

      case "follow":
        if (!isFollowed) {
          requestWithLogin("post", `users/auth/follow`, {
            target: user.id,
          })
            .then(() => refreshFollowList("followed"))
            .catch((reason) => console.log(reason));
        }
        break;

      case "unfollow":
        if (isFollowed) {
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
    setBio(user.bio);
  }, [user]);

  const edit = (type: "username" | "bio", value: string) => {
    setEditType(type);

    switch (type) {
      case "username":
        if (user.username === value) return;
        break;

      case "bio":
        if (user.bio === value) return;
        break;
    }

    setTemp(value);
    setPwPopup(true);
  };

  return (
    <div className={cx("info-container")}>
      <span
        className={cx("info-profile-image")}
        onClick={() => setUploadPopup(true)}
      >
        <ProfileImage
          image={user.profile}
          size={15 * 16}
          style={{
            borderWidth: 2,
            borderStyle: "solid",
            borderColor: "#777777",
          }}
        ></ProfileImage>
      </span>
      <div className={cx("info-text-container")}>
        <EditableText
          className={cx("info-username")}
          value={username}
          onChange={setUsername}
          onEdit={(value) => edit("username", value)}
          editable={isMine}
        />
        <EditableText
          className={cx("info-bio")}
          value={bio}
          onChange={setBio}
          onEdit={(value) => edit("bio", value)}
          editable={isMine}
          multiline
          rows={3}
          defaultValue={isMine ? "bio..." : ""}
        />
        <div className={cx("info-value-container")}>
          <div>{following} 팔로잉</div>
          <div>{followed} 팔로워</div>
        </div>
        <div className={cx("info-value-container")}>
          <div>0 카페 가입</div>
          <div>0 카페 소유</div>
        </div>
        <div className={cx("info-value-container")}>
          <div>0 게시글</div>
          <div>0 댓글</div>
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
              className={cx("info-button", "info-button-1")}
              hidden={isMine}
              onClick={() => action(isFollowed ? "unfollow" : "follow")}
            >
              {isFollowed ? "언팔로우" : "팔로우"}
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
        visible={pwPopup}
        onVisibleChange={setPwPopup}
        input={{
          type: "password",
          confirmCondition: (value) => validate("password", value),
        }}
        onClose={(e) => {
          if (e.button === "confirm") {
            const storage = getStorage();
            const showMessage = (message: string) => {
              sendMessage("오류", message);
              if (editType === "username") setUsername(user.username);
              if (editType === "bio") setBio(user.bio);
            };
            let data;

            if (
              editType === "username" &&
              validate("username", temp, showMessage)
            )
              data = { username: temp };
            else if (editType === "bio" && validate("bio", temp, showMessage))
              data = { bio: temp };
            else return;

            request(
              "patch",
              `${getServer()}/user/auth/update`,
              {
                oldPassword: e.input?.value,
                ...data,
              },
              {
                Authorization: storage?.login?.jwt,
              }
            )
              .then(() => {
                if (editType === "username") user.username = temp;
                if (editType === "bio") user.bio = temp;
              })
              .catch(() => {
                sendMessage(
                  "오류",
                  `${
                    editType === "username" ? "닉네임" : "bio"
                  } 변경에 실패하였습니다.`
                );
                if (editType === "username") setUsername(user.username);
                if (editType === "bio") setBio(user.bio);
              });
          } else {
            if (editType === "username") setUsername(user.username);
            if (editType === "bio") setBio(user.bio);
          }
        }}
      />
      <Popup
        title="프로필 사진 변경"
        message="프로필을 변경하시려면 사진을 업로드 하세요."
        type="upload"
        visible={uploadPopup}
        onVisibleChange={setUploadPopup}
        onClose={(e) => {
          if (e.button === "confirm" && e.upload?.file) {
            const formData = new FormData();
            formData.append("file", e.upload?.file);
            axios
              .post(`${getServer()}/file/auth/upload?role=profile`, formData, {
                headers: {
                  Authorization: getStorage()?.login?.jwt,
                  "Content-Type": "multipart/form-data",
                },
              })
              .then(() => {
                window.location.reload();
              })
              .catch((reason) => {
                console.log(reason);
                sendMessage("오류", "프로필 사진 업로드에 실패하였습니다.");
              });
          } else if (e.button !== "cancel")
            sendMessage("오류", "프로필 사진 업로드에 실패하였습니다.");
        }}
        upload={{
          defaultPreview: `${getCdn()}/${getStorage()?.user?.profile!}`,
          confirmCondition: (value) => value !== null,
          imgSizeXLimit: imgLimit.profile.imgSizeX,
          imgSizeYLimit: imgLimit.profile.imgSizeY,
          sizeLimit: imgLimit.profile.fileSize,
          exts: imgLimit.profile.exts,
        }}
        onError={(message) => sendMessage("오류", message)}
      />

      <Popup
        title={messagePopup.title}
        message={messagePopup.message}
        visible={messagePopup.visible}
        onVisibleChange={(v) =>
          setMessagePopup({ ...messagePopup, visible: v })
        }
        button={["confirm"]}
      />
    </div>
  );
};

export default UserInfo;
