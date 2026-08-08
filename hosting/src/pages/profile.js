import React from 'react';
import { graphql } from 'gatsby';
import { Link, useTranslation } from 'gatsby-plugin-react-i18next';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

import Layout from '../components/layout';
import { withAuthentication, AuthUserContext } from '../components/Session';
import SignOutLink from '../components/Block/SignOutLink';
import MessagingRequestPermission from '../components/Block/MessagingRequestPermission';

const style = {
  textSm: {
    fontSize: '13px'
  }
};

const RequestPermissionLink = ({ onClick, style: styleProp }) => {
  const { t } = useTranslation();
  let token = null;
  try {
    token = !!localStorage.getItem('messagingToken');
  } catch (e) {
    console.error(e);
  }

  return (
        <button className="btn btn-link mt-1 p-0" onClick={onClick} style={styleProp}>
            {t('Enable browser notifications')}
            <FontAwesomeIcon icon={token ? faCheckCircle : faExclamationCircle} className="ml-1 p-0" color={token ? 'green' : 'gray'} />
        </button>
  );
};

const Profile = ({ authUser }) => {
  const { t } = useTranslation();

  if (!authUser) {
    return <Layout>{t('Please sign in')}</Layout>;
  }

  return (
            <Layout>
                <div style={style.textSm}>
                    <div className="pt-card row my-3">
                        <div className="col border-bottom border-light mb-3 p-3 d-flex flex-column justify-content-center">
                            <div className="d-flex flex-column justify-content-center mx-auto text-center">
                                <img src={authUser.photoURL} className="pt-profile-avatar mb-3" alt="..." />
                                <h6>{authUser.displayName}</h6>
                                <small>{authUser.email}</small>
                            </div>
                        </div>

                        <div className="col">
                            <h6>{t('Basic information')}</h6>
                            <ul style={style.textSm}>
                                <li>
                                    {t('Email')}: {authUser.email}
                                </li>
                                <li>
                                    {t('Registered')}: {
                                        moment(parseInt(authUser.createdAt, 10)).fromNow()
                                    }
                                </li>
                                <li>
                                    {t('Last sign in')}: {
                                        moment(parseInt(authUser.lastLoginAt, 10)).fromNow()
                                    }
                                </li>
                            </ul>

                            <h6>{t('Links')}</h6>
                            <ul style={style.textSm}>
                                <li>
                                    <Link to="/my_product/">{t('My Products')}</Link>
                                </li>
                                <li>
                                    <SignOutLink style={style.textSm} />
                                </li>
                            </ul>
                        </div>
                        <div className="col">
                            <h6>{t('Preferences')}</h6>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="setting" disabled="disabled" value="hide_email" />
                                <label className="form-check-label" forhtml="setting">{t('Hide my email')}</label>
                            </div>

                            <div className="form-check">
                                <MessagingRequestPermission>
                                    <RequestPermissionLink style={style.textSm} />
                                </MessagingRequestPermission>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
  );
};

const ProfileComponent = (props) => (
    <AuthUserContext.Consumer>
        {(authUser) => <Profile authUser={authUser} {...props} />}
    </AuthUserContext.Consumer>
);

export default withAuthentication(ProfileComponent);

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;
