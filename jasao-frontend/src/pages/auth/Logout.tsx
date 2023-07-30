import { useEffect } from "react";
import { getStorage, saveStorage } from "../../util/storage";
import { getServer, request } from "../../util/server";

export default function Logout() {
  useEffect(() => {
    const storage = getStorage();
    if (!storage || !storage.login?.login) return;
    console.dir(storage);

    request(
      "get",
      `${getServer()}/user/auth/logout`,
      {},
      {
        Authorization: storage?.login?.jwt,
      }
    )
      .then(() => {
        storage.login = undefined;
        storage.user = undefined;

        saveStorage(storage);

        window.location.replace("/");
      })
      .catch(() => {
        storage.login = undefined;
        storage.user = undefined;

        saveStorage(storage);

        window.location.replace("/");
      });
  }, []);

  return <h1>Please wait...</h1>;
}
