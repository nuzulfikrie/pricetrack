import React, { Fragment, useState } from 'react';
import { Helmet } from 'react-helmet';
import { OutboundLink as A } from 'gatsby-plugin-google-gtag';
import { useTranslation, useI18next } from 'gatsby-plugin-react-i18next';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { withFirebase } from '../Firebase';
import { AuthUserContext } from '../Session';
import * as ROUTES from '../../constants/routes';
import Menu from './menu';
import AddUrlForm from './addUrlForm';
import Logo from './Logo';
import LanguageSwitcher from '../Block/LanguageSwitcher';


import './header.css';
import notiIcon from './notification.svg';
import profileIcon from './profile.svg';

const UserButton = ({ authUser, onClickSignIn, onClickProfile }) => {
  const { t } = useTranslation();

  if (!authUser) {
    return (
      <button className="pt-btn pt-btn-secondary pt-btn-sm" onClick={onClickSignIn}>
        {t('Sign in')} <FontAwesomeIcon icon={faGoogle} />
      </button>
    );
  }

  return (
    <Fragment>
      <button className="pt-btn pt-btn-secondary pt-btn-sm d-none d-sm-inline-flex" onClick={onClickProfile}>
        {authUser.displayName}
      </button>
      <button className="pt-btn-text d-block d-sm-none" onClick={onClickProfile}>
        <img src={profileIcon} style={{ width: 20 }} alt="" />
      </button>
    </Fragment>
  );
};

const NavigationAuth = ({
  authUser, onClickSignIn, onClickProfile, inputUrl, firebase
}) => {
  const { t } = useTranslation();

  return (
    <Fragment>
      <Helmet bodyAttributes={{
        class: 'bg-light'
      }}>
        <meta charSet="utf-8" />
        <title>{t('Price Tracker & Cashback | Track prices, get cashback')}</title>
      </Helmet>
      <header className="pt-header">
        <div className="pt-header-inner">
          <div>
            <Logo />
          </div>
          <div className="pt-search-form">
            <AddUrlForm authUser={authUser} inputUrl={inputUrl} firebase={firebase} />
          </div>
          <div>
            <div className="d-flex justify-content-end align-items-center" style={{ gap: '8px' }}>
              <LanguageSwitcher />

              <A className="text-muted" href="/" >
                <img src={notiIcon} alt="" />
              </A>

              <UserButton
                authUser={authUser}
                onClickProfile={onClickProfile}
                onClickSignIn={onClickSignIn} />
            </div>
          </div>
        </div>
      </header>
      <Menu authUser={authUser} />
    </Fragment>
  );
};


const NavBarBase = ({ firebase, inputUrl: initialInputUrl }) => {
  const [error, setError] = useState(null);
  const [inputUrl] = useState(initialInputUrl);
  const { navigate } = useI18next();

  const onClickSignIn = (event) => {
    firebase
      .doSignInWithGoogle()
      .then((socialAuthUser) => {
        console.log('socialAuthUser', socialAuthUser);
        setError(null);
        navigate(ROUTES.HOME);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
      });

    event.preventDefault();
  };

  const onClickProfile = () => navigate(ROUTES.PROFILE);

  return (
    <AuthUserContext.Consumer>
      {(authUser) => <NavigationAuth authUser={authUser}
                                   onClickSignIn={onClickSignIn}
                                   onClickProfile={onClickProfile}
                                   inputUrl={inputUrl}
                                   firebase={firebase}
                                   error={error} />}
    </AuthUserContext.Consumer>
  );
};

const NavBar = withFirebase(NavBarBase);
export default NavBar;
