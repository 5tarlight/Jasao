import { useEffect } from "react";
import { getStorage, saveStorage } from "../../util/storage";

export default function Logout() {
  useEffect(() => {
    const storage = getStorage();

    if ((storage && storage.user && storage.user.login) || false) {
      saveStorage({
        ...storage,
        user: undefined,
      });
    }

    window.location.replace("/");
  }, []);

  return <h1>Please wait...</h1>;
}
