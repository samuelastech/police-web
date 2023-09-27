import { useNavigate, Link } from "react-router-dom";
import useLogout from "../hooks/useLogout";

export default function Home() {
  const logout = useLogout();
  const navigate = useNavigate();

  const signout = async () => {
      await logout();
      navigate('/login');
  }

  return (
      <section>
          <h1>Home</h1>
          <br />
          <p>You are logged in!</p>
          <br />
          <Link to="/app">Go to the Map</Link>
          <br />
          <Link to="/admin">Go to the Admin page</Link>
          <br />
          <Link to="/dashboard">Go to the Dashboard</Link>
          <div className="flexGrow">
              <button onClick={signout}>Sign Out</button>
          </div>
      </section>
    )
}
