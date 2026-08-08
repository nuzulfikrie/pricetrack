import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/layout';

export default () => (
  <Layout>
    TODO
  </Layout>
);

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
