import { useSelector } from "react-redux";

export default function Dashboard() {
  const { user, accessToken } = useSelector((state) => state.auth);

  return (
    <div>
      {user ? <h1>Welcome, {user.username}</h1> : <p>You are not logged in.</p>}
    </div>
  );
}
