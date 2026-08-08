/* eslint-disable no-alert */
import React from 'react';
import { useTranslation, useI18next } from 'gatsby-plugin-react-i18next';
import { withFirebase } from '../Firebase';

import { HOME } from '../../constants/routes';

const SignOutLink = ({ firebase, style: styleProp }) => {
  const { t } = useTranslation();
  const { navigate } = useI18next();

  const doLogout = (e) => {
    if (window.confirm(t('Are you sure?')) === true) {
      firebase.doSignOut();
      navigate(HOME);
    }
    e.preventDefault();
  };

  const style = { ...styleProp, padding: 0 };
  return <button className='btn btn-link' style={style} onClick={doLogout}>{t('Sign out')}</button>;
};

export default withFirebase(SignOutLink);
