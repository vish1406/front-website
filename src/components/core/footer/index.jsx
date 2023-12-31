/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import './footer.css';
import { useSelector } from 'react-redux';
import { Col } from 'reactstrap';

function Footer({ sidebarLeft, sidebarRight }) {
  const isSidebarLeft = sidebarLeft !== undefined;
  const isSidebarRight = sidebarRight !== undefined;
  const { themeSettings } = useSelector((state) => state.themeSettings);

  const contentMdColWidth = isSidebarLeft
    ? isSidebarRight
      ? '8'
      : '10'
    : isSidebarRight
    ? '9'
    : '12';

  return (
    <div className="row footer-row ">
      {sidebarLeft ? (
        <div className="col-md-2 col-sm-12 col-12 left-sidebar" />
      ) : null}
      <Col
        md="8"
        lg={contentMdColWidth}
        className={`footer-area ${
          isSidebarRight && isSidebarLeft ? 'main-content' : ''
        }`}
      >
        <footer className="footer">
          <div className="row">
            <div className="col-md-4 col-sm-12 col-12">
              <div className="logo">
                <a href="#">
                  <img
                    src={
                      themeSettings?.logoImage
                        ? themeSettings?.logoImage
                        : 'images/logo.png'
                    }
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = 'images/logo.png';
                    }}
                    className="footer-logo"
                  />
                </a>
              </div>

              <div className="support-image">
                <div>
                  <img src="images/support-icon.svg" />
                </div>
                <div className="d-flex flex-column align-items-start ps-1">
                  <div className="support-text">24X7 Support</div>
                  <div className="support-number">
                    {themeSettings?.supportNumber || ''}
                  </div>
                </div>
              </div>

              <div className="social-feeds">
                {themeSettings?.facebookLink ? (
                  <div className="icon">
                    <a
                      href={themeSettings?.facebookLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img src="images/facebook.png" />
                    </a>
                  </div>
                ) : (
                  ''
                )}

                {themeSettings?.twitterLink ? (
                  <div className="icon">
                    <a
                      href={themeSettings?.twitterLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img src="images/twitter.png" />
                    </a>
                  </div>
                ) : (
                  ''
                )}
                {themeSettings?.instagramLink ? (
                  <div className="icon">
                    <a
                      href={themeSettings?.instagramLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img src="images/insta.png" />
                    </a>
                  </div>
                ) : (
                  ''
                )}
                {themeSettings?.telegramLink ? (
                  <div className="icon">
                    <a
                      href={themeSettings?.telegramLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img src="images/telegram.png" />
                    </a>
                  </div>
                ) : (
                  ''
                )}
                {themeSettings?.youtubeLink ? (
                  <div className="icon">
                    <a
                      href={themeSettings?.youtubeLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img src="images/youtube.png" />
                    </a>
                  </div>
                ) : (
                  ''
                )}
                {themeSettings?.whatsappLink ? (
                  <div className="icon">
                    <a
                      href={themeSettings?.whatsappLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img src="images/watsapp.png" />
                    </a>
                  </div>
                ) : (
                  ''
                )}
                {themeSettings?.blogLink ? (
                  <div className="icon">
                    <a
                      href={themeSettings?.blogLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img src="images/blog.png" />
                    </a>
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>

            <div className="col-md-8 col-sm-12 col-12">
              <div className="footer-right-col">
                <div className="footer-title">Company Information</div>
                <div className="footer-menu">
                  <ul className="menu-items">
                    <li className="menu">
                      <a href="#" className="items">
                        About Us
                      </a>
                    </li>
                    <li className="menu">
                      <a href="#" className="items">
                        Terms & Condition
                      </a>
                    </li>
                    <li className="menu">
                      <a href="#" className="items">
                        Responsible Gaming
                      </a>
                    </li>
                    <li className="menu">
                      <a href="#" className="items">
                        Blog
                      </a>
                    </li>
                    <li className="menu">
                      <a href="#" className="items">
                        AML Policy
                      </a>
                    </li>
                    <li className="menu">
                      <a href="#" className="items">
                        KYC Policy
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="footer-box">
                  <div className="footer-top">
                    <div className="d-inline-block footer-other">
                      <a href="#">
                        <img src="images/18plus.png" />
                      </a>
                      <a href="#" target="_blank">
                        <img src="images/gamecare.png" />
                      </a>
                      <a href="#" target="_blank">
                        <img src="images/gt.png" />
                      </a>
                    </div>
                    <div className="secure-logo">
                      <div className="ml-2">
                        <b>100% SAFE</b>
                        <div>Protected connection and encrypted data.</div>
                      </div>
                      <div>
                        <img src="images/ssl.png" />
                      </div>
                    </div>
                  </div>
                  <div className="footer-bottom">
                    <span className="ws-pre-wrap">
                      {themeSettings?.footerMessage || ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>

        <div className="copyright-text">
          © 2023 Exchange All Rights Reserved
        </div>
      </Col>
      {/* <div className="col-md-8 col-sm-8 col-12 footer-area"></div> */}
      {sidebarRight ? (
        <div className="col-md-2 col-sm-12 col-12 right-side" />
      ) : null}
    </div>
  );
}

export default Footer;
