import {useState} from 'react'
import Wrapper from '../assets/wrappers/Navbar'
import {FaAlignLeft, FaUserCircle, FaCaretDown} from 'react-icons/fa'
import { useAppContext } from "../context/appContext";
import Logo from "./Logo";

const NavBar = () => {
  const [showLogout, setShowLogout] = useState(false)
  const { toggleSidebar, logoutUser, user } = useAppContext()
  return (
    <Wrapper>
      <div className="nav-center">
        <button
          className="toggle-btn"
          onClick={toggleSidebar}
        >
          <FaAlignLeft />
        </button>

        <div>
          <Logo />
          <h3 className="logo-text">dashboard</h3>
        </div>

        <div className="btn-container">
          <button className="btn" onClick={() => setShowLogout(!showLogout)}>
            <FaUserCircle />
            {user?.name}
            <FaCaretDown />
          </button>
          <div className={showLogout? "dropdown show-dropdown" : 'dropdown'}>
            <button
              onClick={() => logoutUser()}
              className="dropdown-btn"
            >
              logout
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default NavBar
