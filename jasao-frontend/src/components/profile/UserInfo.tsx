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
import axios from "axios";
import InputPopup from "../popup/InputPopup";
import UploadFilePopup from "../popup/UploadFilePopup";
import Popup, { buttonType } from "../popup/Popup";
import ChangePasswordPopup from "../popup/ChangePasswordPopup";

const cx = classNames.bind(styles);

type UserActionType =
  | "change-password"
  | "follow"
  | "unfollow"
  | "block"
  | "unblock"
  | "remove-profile-image";

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
  reloadUser: () => void;
}

const UserInfo: FC<Props> = ({ user, isMine, myId, reloadUser }) => {
  const [temp, setTemp] = useState("");
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [followed, setFollowed] = useState<number>(0);
  const [following, setFollowing] = useState<number>(0);
  const [editType, setEditType] = useState<"username" | "bio">("username");

  const [uploadPopup, setUploadPopup] = useState(false);
  const [pwPopup, setPwPopup] = useState(false);
  const [changePwPopup, setChangePwPopup] = useState(false);
  const [askPopup, setAskPopup] = useState({
    visible: false,
    title: "",
    message: "",
    yes: "예",
    no: "아니요",
    onSubmit: (value: boolean) => {},
  });
  const [messagePopup, setMessagePopup] = useState<{
    visible: boolean;
    title: string;
    message: string;
    callback: ((btn: buttonType) => void) | undefined;
  }>({
    visible: false,
    title: "",
    message: "",
    callback: undefined,
  });

  const sendMessage = (
    title: string,
    message: string,
    callback?: (btn: buttonType) => void
  ) => {
    setMessagePopup({
      title,
      message,
      visible: true,
      callback,
    });
  };

  const sendAsk = (
    title: string,
    message: string,
    onSubmit: (value: boolean) => void
  ) => {
    setAskPopup({
      ...askPopup,
      title,
      message,
      onSubmit,
      visible: true,
    });
  };

  const action = (type: UserActionType) => {
    switch (type) {
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

      case "change-password":
        setChangePwPopup(true);
        break;

      case "block":
        requestWithLogin("post", "users/auth/block", { target: user.id }).then(
          () => refreshIsBlocking()
        );
        break;

      case "unblock":
        requestWithLogin("delete", `users/auth/unblock?target=${user.id}`)
          .then(() => refreshIsBlocking())
          .catch((r) => console.log(r));
        break;

      case "remove-profile-image":
        requestWithLogin("delete", "user/auth/profile/delete");
        // .then((res) => console.log(res))
        // .catch((reason) => console.log(reason));
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

  const refreshIsBlocking = useCallback(() => {
    requestWithLogin<{ message: string; data: boolean }>(
      "get",
      `users/auth/isblocking?target=${user.id}`
    )
      .then((res) => setIsBlocked(res.data))
      .catch((reason) => console.log(reason));
  }, [setIsBlocked, user.id]);

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
    refreshIsBlocking();
  }, [setIsBlocked, user.id, refreshIsBlocking]);

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
            onClick={() => action("change-password")}
          >
            비밀번호 변경
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
        <div
          className={cx("info-block")}
          onClick={() => action(isBlocked ? "unblock" : "block")}
        >
          {isBlocked ? "차단 해제" : "차단"}
        </div>
      ) : undefined}

      <InputPopup
        title="비밀번호를 입력하세요."
        visible={pwPopup}
        onVisibleChange={setPwPopup}
        inputType="password"
        confirmCondition={(e) => validate("password", e.value)}
        onCancel={() => {
          if (editType === "username") setUsername(user.username);
          if (editType === "bio") setBio(user.bio);
        }}
        onSubmit={(e) => {
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

          requestWithLogin("patch", `user/auth/update`, {
            oldPassword: e.value,
            ...data,
          })
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
        }}
      />
      <UploadFilePopup
        title="프로필 사진 변경"
        message="프로필을 변경하시려면 사진을 업로드 하세요."
        visible={uploadPopup}
        onVisibleChange={setUploadPopup}
        defaultPreview={
          user.profile ? `${getCdn()}/${user.profile}` : "/person.svg"
        }
        confirmCondition={(value) => value !== null}
        limitImgSizeX={imgLimit.profile.imgSizeX}
        limitImgSizeY={imgLimit.profile.imgSizeY}
        limitFileSize={imgLimit.profile.fileSize}
        acceptExts={imgLimit.profile.exts}
        deleteBtn={!!user.profile}
        onSubmit={(e) => {
          if (e.file === null) {
            sendMessage("오류", "프로필 사진 업로드에 실패하였습니다.");
            return;
          }

          const formData = new FormData();
          formData.append("file", e.file);
          axios
            .post(`${getServer()}/user/auth/profile`, formData, {
              headers: {
                Authorization: getStorage()?.login?.jwt,
                "Content-Type": "multipart/form-data",
              },
            })
            .then(() => {
              reloadUser();
              window.location.reload();
            })
            .catch((reason) => {
              console.log(reason);
              sendMessage("오류", "프로필 사진 업로드에 실패하였습니다.");
            });
        }}
        onDelete={() => {
          sendAsk(
            "프로필 사진 삭제",
            "프로필 사진을 삭제하시겠습니까?",
            (yes) => {
              if (!yes) return;
              sendMessage(
                "프로필 사진 삭제",
                "프로필 사진을 삭제하였습니다.",
                () => {
                  reloadUser();
                  window.location.reload();
                }
              );
              action("remove-profile-image");
              setUploadPopup(false);
            }
          );
        }}
        onError={(message) => sendMessage("오류", message)}
      />
      <ChangePasswordPopup
        title="비밀번호 변경"
        visible={changePwPopup}
        onVisibleChange={setChangePwPopup}
        onSubmit={(e) => {
          if (
            validate("password", e.curPw, (m) => sendMessage("오류", m)) &&
            validate("password", e.newPw, (m) => sendMessage("오류", m))
          ) {
            requestWithLogin("patch", `user/auth/update`, {
              oldPassword: e.curPw,
              password: e.newPw,
            })
              .then(() =>
                sendMessage("비밀번호 변경", "비밀번호를 변경하였습니다.")
              )
              .catch((reason) => {
                if (`${reason}`.includes("403"))
                  sendMessage(
                    "오류",
                    `비밀번호 변경에 실패하였습니다.\n비밀번호를 확인하시기 바랍니다.`
                  );
                else
                  sendMessage(
                    "오류",
                    `비밀번호 변경에 실패하였습니다.\n${reason}`
                  );
              });
          }
        }}
      />

      <Popup
        title={messagePopup.title}
        message={messagePopup.message}
        visible={messagePopup.visible}
        onVisibleChange={(v) =>
          setMessagePopup({ ...messagePopup, visible: v })
        }
        button={["confirm"]}
        onButtonClick={(btn) => {
          if (messagePopup.callback) messagePopup.callback(btn);
        }}
      />

      <Popup
        title={askPopup.title}
        message={askPopup.message}
        visible={askPopup.visible}
        onVisibleChange={(v) => setAskPopup({ ...askPopup, visible: v })}
        buttonText={{
          confirm: askPopup.yes,
          cancel: askPopup.no,
        }}
        onButtonClick={(btn) => askPopup.onSubmit(btn === "confirm")}
      />
    </div>
  );
};

export default UserInfo;
