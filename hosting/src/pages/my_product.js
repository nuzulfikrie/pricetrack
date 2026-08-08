import React, { PureComponent } from 'react';
import { graphql } from 'gatsby';
import axios from 'axios';
import { loadProgressBar } from 'axios-progress-bar';
import 'axios-progress-bar/dist/nprogress.css';
import { withTranslation } from 'gatsby-plugin-react-i18next';

import Layout from '../components/layout';
import ProductList from '../components/Block/ProductList';
import Loading from '../components/Block/Loading';
import { withAuthentication, AuthUserContext } from '../components/Session';
import HeadSlogan from '../components/Block/HeadSlogan';
import SortControl from '../components/Block/SortControl';

loadProgressBar();

const DEFAULT_NUMBER_ITEMS = 15;

class MyProductComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      urls: [],
      loading: false,
      error: false,

      orderBy: 'created_at',
      desc: 'true',
      addBy: '',
      following: false,
      currentMode: 'my_product',
      limit: DEFAULT_NUMBER_ITEMS,
      next: false,
      latest_params: {}
    };
  }

    orderByModes = () => Object.keys(this.SORT_TEXT)

    setOtherBy(mode) {
      const currentMode = mode;
      const { orderBy, desc } = this.state;
      const following = currentMode === 'my_product_following';

      let newDesc = desc;
      if (mode === this.state.currentMode) {
        newDesc = desc === 'true' ? 'false' : 'true';
      }
      const newAddBy = this.props.authUser.email;

      this.setState({
        currentMode, orderBy, desc: newDesc, addBy: newAddBy, following
      }, () => this._loadData());
    }

    async componentDidMount() {
      const authUser = this.props.authUser || {};
      const addBy = authUser.email || '';
      this.setState({ addBy }, () => this._loadData());
    }

    async _fetchData(params) {
      console.log('context authUser', this.props.authUser);

      const response = await axios.get('/api/listUrls', { params });
      const { data, headers } = response;
      const nextStartAt = headers.nextstartat || null;
      params['startAt'] = nextStartAt;

      return { urls: data, next: nextStartAt, params };
    }

    async _loadData() {
      this.setState({ loading: true });

      const params = {
        orderBy: this.state.orderBy,
        desc: this.state.desc,
        limit: this.state.limit,
        addBy: this.state.addBy,
        following: this.state.following
      };

      try {
        const { urls, next } = await this._fetchData(params);
        this.setState({
          urls, next, loading: false, latest_params: params
        });
      } catch (err) {
        console.error(err);
        this.setState({ loading: false, error: true });
      }
    }

    async onClickLoadMore(params) {
      try {
        const { urls, next } = await this._fetchData(params);
        const newUrls = [...this.state.urls, ...urls];
        this.setState({ urls: newUrls, next });
      } catch (err) {
        console.error(err);
        this.setState({ loading: false, error: true });
      }
    }

    renderListUrl() {
      const { t } = this.props;

      if (this.state.loading) return <Loading />;
      if (this.state.error) return t('Something went wrong, please reload');

      return <ProductList urls={this.state.urls}
                            loadMore={this.state.next}
                            onClickLoadMore={
                                () => this.onClickLoadMore(this.state.latest_params)
                            } />;
    }


    render() {
      const { t } = this.props;
      const sortText = {
        my_product: t('All'),
        my_product_following: t('Following'),
      };

      return (
            <Layout>
                <div className="pt-hero">
                    <HeadSlogan sub_headline={t('My Products')} />

                    <div className="pt-sort-controls">
                        <SortControl
                          sortText={sortText}
                          currentMode={this.state.currentMode}
                          desc={this.state.desc} />
                   </div>
                </div>

                <div className="pt-card my-3" id="listUrls">
                    {this.renderListUrl()}
                </div>
            </Layout>
      );
    }
}

const MyProductComponentTranslated = withTranslation()(MyProductComponent);

const MyProductComponentWithContext = (props) => {
  const { t } = props;
  return (
    <AuthUserContext.Consumer>
        {(authUser) => (authUser ? <MyProductComponentTranslated authUser={authUser} /> : t('Loading...'))}
    </AuthUserContext.Consumer>
  );
};

export default withAuthentication(withTranslation()(MyProductComponentWithContext));

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
