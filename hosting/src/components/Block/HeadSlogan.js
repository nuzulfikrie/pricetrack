import React from 'react';
import { useTranslation } from 'gatsby-plugin-react-i18next';

import IMG_LINECHART from '../../../static/animat-linechart-color.gif';
import IMG_CHECKMARK from '../../../static/animat-checkmark-color.gif';
import IMG_IMAGE from '../../../static/animat-image-color.gif';

const icons = {
  linechart: IMG_LINECHART,
  checkmark: IMG_CHECKMARK,
  image: IMG_IMAGE,
};

export default (props) => {
  const { t } = useTranslation();

  return (
    <div className="d-flex flex-grow-1 align-items-center">
        <div className="pt-hero-icon">
            <img src={icons[props.icon || 'linechart']} alt="" width="28" height="28" />
        </div>
        <div>
            <h2 style={{ margin: 0 }}>{props.headline || t('Track prices')}</h2>
            <p>{props.sub_headline || t('beta')}</p>
        </div>
    </div>
  );
};
