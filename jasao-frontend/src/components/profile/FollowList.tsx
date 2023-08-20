import { FC, useCallback, useEffect, useState } from "react";
import styles from "../../styles/profile/FollowList.module.scss";
import classNames from "classnames/bind";
import { getServer, request } from "../../util/server";
import ProfileImage from "./ProfileImage";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

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
  type: "followed" | "following";
  targetId: number;
  page?: number;
}

const FollowList: FC<Props> = ({ type, targetId, page: defaultPage = 0 }) => {
  const [page, setPage] = useState(defaultPage);
  const [data, setData] = useState<FollowRes>();
  const navigate = useNavigate();

  const load = useCallback(() => {
    request<FollowRes>(
      "get",
      `${getServer()}/users/${type}?id=${targetId}&page=${page}`,
      {}
    )
      .then((res) => setData(res.data))
      .catch(() =>
        console.log(`failed get ${type} list: user/${targetId} (page: ${page})`)
      );
  }, [type, page, targetId]);

  useEffect(() => {
    load();
  }, [load, type, targetId, page]);

  const link = (id: number) => {
    navigate(`/user/${id}`);
  };

  return data ? (
    <div className={cx("container")}>
      <div className={cx("item-wrapper")}>
        {data
          ? data.data.payload.map((user, i) => (
              <div className={cx("item")} key={i}>
                <div
                  className={cx("profile-image")}
                  onClick={() => link(user.id)}
                >
                  <ProfileImage image={user.profile} size={"3.5rem"} />
                </div>
                <div className={cx("text")}>
                  <div className={cx("username")} onClick={() => link(user.id)}>
                    {user.username}
                  </div>
                  <div className={cx("bio")}>{user.bio} test BIO!</div>
                </div>
              </div>
            ))
          : undefined}
      </div>
      <div className={cx("page-selector")}>
        <div
          className={cx("page-previous")}
          onClick={() => {
            if (page > 0) setPage(page - 1);
          }}
        >
          {"<"}
        </div>
        <div className={cx("page-text")}>
          {`${page + 1} / ${data.data.maxPage > 0 ? data.data.maxPage : 1}`}
        </div>
        <div
          className={cx("page-next")}
          onClick={() => {
            if (page < data.data.maxPage - 1) setPage(page + 1);
          }}
        >
          {">"}
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default FollowList;
