import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../app/slices/authSlice";
import Onboarding from "../components/Onboarding/Onboarding";

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = async (): Promise<void> => {
    await fetch(`${apiUrl}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    dispatch(logout());
    navigate("/login");
  };

  return (
    <main>
      <button onClick={() => handleLogout()}>Logout</button>
      {user?.firstSignIn && <Onboarding />}
    </main>
  );
};

export default Dashboard;
