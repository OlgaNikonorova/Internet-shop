import { Navigate, Outlet } from "react-router-dom";
import Header from "../components/header/header";
import { useTypedSelector } from "../store/hooks";
import { isAuthSelector } from "../store/slices/user-slice";

export default function ProtectedLayout() {
  const isAuth = useTypedSelector(isAuthSelector);

  if (!isAuth) {
    return <Navigate to="/auth" replace />;
  }
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
