import React from 'react';
import { faUnlink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'gatsby-plugin-react-i18next';

const styles = {
  icon: {
    marginRight: 20,
  },
  txt: {}
};

export default () => {
  const { t } = useTranslation();

  return (
    <div className="d-flex justify-content-center">
        <h1>
            <FontAwesomeIcon icon={faUnlink} style={styles.icon} />
            <span style={styles.txt}>{t('Page not found')}</span>
        </h1>
    </div>
  );
};
