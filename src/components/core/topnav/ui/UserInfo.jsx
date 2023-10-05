import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';
import { io } from 'socket.io-client';
import { userLogout } from '../../../../helper/user';
import { resetUserDetails } from '../../../../redux/reducers/user-details';
import StateButtons from '../../stake-button-popup';
import './userInfo.css';

// const UserInfo = ({ user }) => {
//   const [showStakButton, setShowStakeButton] = useState(false);

const socketUrl = import.meta.env.VITE_SOCKET_URL;
const userUrl = `${socketUrl}/user`;
const socket = io(userUrl, {
  auth: { token: localStorage.getItem('userToken') },
  autoConnect: false,
});

const UserInfo = ({ user }) => {
  const dispatch = useDispatch();

  const [userInfo, setUserInfo] = useState(user);
  const [showStakButton, setShowStakeButton] = useState(false);

  useEffect(() => {
    socket.on(`user:${user._id}`, (data) => {
      setUserInfo(data);
      // localStorage.setItem('user', JSON.stringify(data));
    });
    socket.connect();
    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = () => {
    dispatch(resetUserDetails());
    userLogout();
  };

  return (
    <div className="header-right">
      <div className="balance d-none-mobile rounded">
        <div>
          <img src="./images/ico2.png" alt="wallet" />
        </div>

        <table>
          <tbody>
            <tr>
              <td className="balance-value">pts:</td>
              <td className="ps-1 small text-end">{userInfo?.balance || 0}</td>
            </tr>
            <tr>
              <td className="balance-value">exp:</td>
              <td className="ps-1 small text-end">
                {userInfo?.exposure
                  ? -parseFloat(userInfo.exposure.toFixed(2))
                  : 0}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="text-center d-none-desktop bal-point">
        pts:
        <span>{user?.balance || 0}</span>{' '}
        <span>| {userInfo?.exposure || 0}</span>
      </div>
      <div className="d-flex">
        <UncontrolledDropdown>
          <DropdownToggle caret color="dark" className="username-info">
            <span className="user-icon">
              <img src="./images/userrr.png" alt="user" />
            </span>
            {userInfo?.fullName || ''}
          </DropdownToggle>

          <DropdownMenu dark>
            <DropdownItem>Account Statement</DropdownItem>
            <DropdownItem href="/currentbets">Current Bets</DropdownItem>
            <DropdownItem>Casino Results</DropdownItem>
            <DropdownItem onClick={() => setShowStakeButton(true)}>
              Set Button Value
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem onClick={() => logout()}>Logout</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
        {showStakButton && (
          <StateButtons
            isOpen={showStakButton}
            closeModal={() => setShowStakeButton(!showStakButton)}
          />
        )}
        {/* Notification */}
        <UncontrolledDropdown>
          <DropdownToggle caret className="notification-icon">
            <img
              src="./images/icons-bell.png"
              alt="bell-icon"
              className="w-50 h-50"
            />
          </DropdownToggle>
          <DropdownMenu className="notification-menu">
            <div className="card border-0 w300">
              <div className="card-header notification-header">
                <h5 className="mb-0">
                  <span>Notifications</span>
                </h5>
              </div>
              <div className="card-body p-0 notification-body">
                <div className="fade show active">
                  <ul className="list-unstyled list mb-0">
                    <li className="notification-item">
                      <div className="ps-2 pe-2">
                        <p className="d-flex justify-content-between mb-0 ">
                          <a href="/" className="text-decoration-none">
                            <span className="item-name">
                              Pakistan V Australia
                            </span>
                          </a>
                          <small className="notification-date">
                            19 Hours Ago
                          </small>
                        </p>
                      </div>
                    </li>
                    <li className="notification-item">
                      <div className="ps-2 pe-2">
                        <p className="d-flex justify-content-between mb-0 ">
                          <a href="/" className="text-decoration-none w-75">
                            <span className="item-name">
                              Australia Women v West Indies Women
                            </span>
                          </a>
                          <small className="notification-date w-25">
                            1 Day Ago
                          </small>
                        </p>
                      </div>
                    </li>
                    <li className="notification-item">
                      <div className="ps-2 pe-2">
                        <p className="d-flex justify-content-between mb-0 ">
                          <a href="/" className="text-decoration-none w-75">
                            <span className="item-name">
                              South Africa Women v New Zealand Women
                            </span>
                          </a>
                          <small className="notification-date w-25">
                            1 Day Ago
                          </small>
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <a
                className="card-footer text-center border-top-0 notification-footer"
                href="/"
              >
                View All Notifications
              </a>
            </div>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    </div>
  );
};

export default UserInfo;
