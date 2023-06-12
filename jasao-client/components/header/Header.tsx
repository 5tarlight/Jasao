"use client";

import { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import UserIcon from "./UserIcon";

const Header: NextPage = () => {
  const [login, setLogin] = useState(false);
  useEffect(() => setLogin(true));

  return (
    <>
      <header>
        <h1>
          <Link href="/">Jasao</Link>
        </h1>
        <div className="menu">
          <div>11</div>
          <div>11</div>
          <div>11</div>
          <div>11</div>
          <div>11</div>
        </div>
        <div>
          <UserIcon login={login} />
        </div>
      </header>

      <style jsx>{`
        header {
          height: 4rem;
          line-height: 4rem;
          display: flex;
          justify-content: space-between;
          margin-bottom: 4rem;
          user-select: none;
        }

        .menu {
          display: flex;
          width: 30%;
          justify-content: space-between;
        }
      `}</style>
    </>
  );
};

export default Header;
