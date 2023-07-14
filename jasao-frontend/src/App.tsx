import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";
import Index from "./pages";
import styles from "./styles/App.module.scss";
import classNames from "classnames/bind";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Logout from "./pages/auth/Logout";

const cx = classNames.bind(styles);

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className={cx("main-content")}>
        <Routes>
          <Route path="/" element={<Index />} />

          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<SignUp />} />
          <Route path="/auth/logout" element={<Logout />} />

          <Route path="/*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
