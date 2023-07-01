import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";
import Index from "./pages";
import styles from "./styles/App.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className={cx("main-content")}>
        <Routes>
          <Route path="/" element={<Index />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
