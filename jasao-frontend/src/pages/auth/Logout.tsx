import { useEffect } from "react";
import { getStorage, saveStorage } from "../../util/storage";

export default function Logout() {
  useEffect(() => {
    const storage = getStorage();

    if ((storage && storage.login && storage.login.login) || false) {
      storage.login = undefined;
      storage.user = undefined;

      saveStorage(storage);
    }

    window.location.replace("/");
  }, []);

  return <h1>Please wait...</h1>;
}
