import React from 'react';
import { Link, useI18next } from 'gatsby-plugin-react-i18next';

const LANGUAGE_LABELS = {
  en: 'EN',
  ms: 'MY',
};

export default () => {
  const { languages, language, originalPath } = useI18next();

  return (
    <div className="pt-lang-switcher">
      {languages.map((lng) => (
        <Link
          key={lng}
          to={originalPath}
          language={lng}
          className={`pt-lang-switcher-item ${lng === language ? 'is-active' : ''}`}
        >
          {LANGUAGE_LABELS[lng] || lng}
        </Link>
      ))}
    </div>
  );
};
