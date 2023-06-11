"use client";

import { NextPage } from "next";
import { useEffect } from "react";

const Header: NextPage = () => {
  useEffect(() => console.log("HI"));

  return (
    <>
      <header className="header">Hi</header>

      <style jsx>{`
        header {
          background-color: aqua;
        }
      `}</style>
    </>
  );
};

export default Header;
