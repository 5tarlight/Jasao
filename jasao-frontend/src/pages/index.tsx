import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div>
      <h1>Hello World</h1>
      <Link to={"/auth/logout"}>로그아웃</Link>
    </div>
  );
}
