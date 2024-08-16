import { Outlet } from "react-router-dom";
import Topnavigation from "../components/Topnavigation";
const Root = () => {
  return (
    <>
      <Topnavigation />
      <Outlet />
    </>
  );
};

export default Root;
