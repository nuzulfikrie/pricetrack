import React from 'react';
import { Link, useTranslation } from 'gatsby-plugin-react-i18next';

import MENUS from '../../constants/menu';

export default ({ authUser }) => {
  const { t } = useTranslation();

  return (
    <div className="pt-nav" style={{ justifyContent: 'center', marginBottom: '8px' }}>
        {
            MENUS.map((item) => {
              if (item.auth && !authUser) return null;
              return (
                    <Link key={item.path}
                        to={item.path}
                        activeStyle={{ fontWeight: 700 }}>
                        {t(item.text)}
                    </Link>
              );
            })
        }
    </div>
  );
};
