import { NextPage } from "next";

interface Props {
  login: boolean;
}

const UserIcon: NextPage<Props> = ({ login }) => {
  if (login) {
    return <div>Login</div>;
  } else {
    return <div>Not Login</div>;
  }
};

export default UserIcon;
