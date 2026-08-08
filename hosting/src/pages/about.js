import React from 'react';
import { graphql } from 'gatsby';
import { useTranslation } from 'gatsby-plugin-react-i18next';

import Layout from '../components/layout';
import CrawlerStatus from '../components/Block/CrawlerStatus';
import Stats from '../components/Block/Stats';
import HeadSlogan from '../components/Block/HeadSlogan';

/**
 * This page is ad hoc, please modify it
 */

const aboutImage = '//i.imgur.com/FgA3sgu.png';
const imageCredit = '';

export default () => {
  const { t } = useTranslation();

  return (
        <Layout>
            <div className="pt-hero">
                <HeadSlogan icon="image" sub_headline={t('About')} />
            </div>

            <div className="pt-card my-3 row">
                <div className="col mb-3">
                    {t('About intro')} <br />
                    {t('About commission')} <br />
                    {t('About open source')} <a href="https://github.com/duyetdev/pricetracker" target="_blank" rel="noopener noreferrer">{t('open source software')}</a>. <br />

                    <br /><br />
                    <h4>{t('System status')}</h4>
                    <CrawlerStatus />

                    <h4>{t('Statistics')}</h4>
                    <Stats />

                    <br />
                    <hr />
                    {t('Contact')}: nuzulfikrie@gmail.com
                </div>

                <div className="col-md-5 col-xs-12 text-center">
                    <img className="img-fluid " src={aboutImage} alt="" />
                    <small>{imageCredit}</small>
                </div>
            </div>

        </Layout>
  );
};

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
