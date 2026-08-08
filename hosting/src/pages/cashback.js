import React, { Component } from 'react';
import { graphql } from 'gatsby';
import axios from 'axios';
import { OutboundLink as A } from 'gatsby-plugin-google-gtag';
import FlashMessage from 'react-flash-message';
import { withTranslation } from 'gatsby-plugin-react-i18next';

// Import React Table
import ReactTable from 'react-table';
import '../styles/react-table.css';

// Modal
import Modal from 'react-awesome-modal';

import Layout from '../components/layout';
import { withAuthentication, AuthUserContext } from '../components/Session';
import HeadSlogan from '../components/Block/HeadSlogan';

const STATUS_KEY = {
  0: 'Pending',
  1: 'Approved',
  2: 'Rejected',
};

class CashbackForm extends Component {
  state = { cashbackUrl: null, inputUrl: null, flashMessage: null }

  onSubmit = (e) => {
    e.preventDefault();

    const { t } = this.props;
    const idToken = localStorage.getItem('authUserIdToken');

    const params = {
      idToken,
      url: this.state.inputUrl,
    };

    axios.post('/api/cashback', { ...params })
      .then((response) => {
        console.log(response);
        if (response.data) {
          const { cashbackUrl } = response.data;
          this.setState({ cashbackUrl });
        }
      })
      .catch((err) => {
        console.error(err);
        if (err.response) {
          const data = err.response.data || {};
          this.showFlashMessage(data.msg || t('Something went wrong'));
          return;
        }

        this.showFlashMessage(err.msg || t('Something went wrong'));
      });
  }

  onChangeInput = (event) => {
    this.setState({ inputUrl: event.target.value });
  }

  showFlashMessage = (message) => {
    this.setState({ flashMessage: null }, () => this.setState({ flashMessage: message }));
  }

  render() {
    const { t } = this.props;
    const cashbackUrlBox = this.state.cashbackUrl
      ? <div className="input-group mb-3">
        <input type="text" className="form-control" value={this.state.cashbackUrl} />
        <div className="input-group-append">
          <A href={this.state.cashbackUrl} target="_blank" rel="noopener noreferrer" className="input-group-text">Go</A>
        </div>
      </div>
      : null;

    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <div className="input-group mb-3">
            <input type="text" className="form-control" onChange={this.onChangeInput} />
            <div className="input-group-append">
              <button className="btn btn-outline-secondary">{t('Create link')}</button>
            </div>
          </div>

          {cashbackUrlBox}
        </form>

        {this.state.flashMessage
          ? <FlashMessage duration={4000}>
              <div className="pt-flash">{this.state.flashMessage}</div>
            </FlashMessage>
          : null}
      </div>
    );
  }
}

class SupportedProvider extends Component {
  state = { providers: {}, loading: false }

  componentDidMount() {
    this.setState({ loading: true });
    axios.get('/api/about')
      .then((response) => {
        const { status } = response.data;
        this.setState({ providers: status, loading: false });
      })
      .catch((err) => {
        console.error(err);
        this.setState({ loading: false, error: true });
      });
  }

  render() {
    const { t } = this.props;

    if (this.state.loading) return t('Loading...');
    if (!Object.keys(this.state.providers).length) return null;

    return (
      <div className="my-3 p-3 bg-white rounded shadow-sm text-center">
        {
          Object.keys(this.state.providers).map((name) => {
            const provider = this.state.providers[name];
            if (!provider.active) return null;
            return <img src={provider.logo}
              key={provider.logo}
              className="img-fluid mr-5"
              alt=""
              style={{ width: 100 }}
              title={provider.domain} />;
          })
        }
      </div>
    );
  }
}

class CashbackBalance extends Component {
  state = {
    data: [],
    totalCommission: 0,
    loading: false,
    modal: false,
    modalContent: null
  }

  componentDidMount() {
    const idToken = localStorage.getItem('authUserIdToken');

    this.setState({ loading: true });
    axios.get('/api/cashbackInfo', { params: { idToken } })
      .then((response) => {
        const { data, totalCommission } = response.data;
        this.setState({ data, totalCommission, loading: false });
      })
      .catch((err) => {
        console.error(err);
        this.setState({ loading: false, error: true });
      });
  }

  _price() {
    if (this.state.loading) return '...';
    return `${this.state.totalCommission} VND`;
  }

  _data() {
    if (!this.state.data) return null;
    return this.state.data;
  }

  showModal = (e, row) => {
    e.preventDefault();
    this.setState({ modal: true, modalContent: row._original });
  }

  _getModalContent() {
    const { t } = this.props;

    if (!this.state.modalContent) return null;
    return (
      <ReactTable
        data={this.state.modalContent.products}
        columns={[
          { Header: t('Time'), accessor: 'click_time' },
          {
            Header: t('Product name'),
            id: 'product_name',
            Cell: ({ row }) => (
              <span className="btn btn-link">{row._original.product_id}</span>
            )
          },
          {
            Header: t('Status'),
            id: 'status',
            accessor: (d) => (
              <span className={
                [
                  'badge',
                  'mr-1',
                  d.status === 0 ? 'badge-warning' : '',
                  d.status === 1 ? 'badge-success' : '',
                  d.status === 2 ? 'badge-danger' : '',
                ].join(' ')
              }>
                {t(STATUS_KEY[d.status])}
              </span>
            )
          },
          { Header: t('Quantity'), accessor: 'product_quantity' },
          { Header: t('Value'), accessor: 'amount' }
        ]}
        defaultPageSize={10}
        minRows={2}
        className="-striped -highlight bg-white shadow-sm text-center size-sm"
      />
    );
  }

  render() {
    const { t } = this.props;

    if (this.state.loading) return t('Loading...');

    return (
      <>
        <div className="pt-card d-flex justify-content-center my-3 text-center">
          <div className="mr-5">
            <span>{t('Your cashback balance')}: </span>
            <span className="pt-product-price-value">{this._price()}</span>
            <div>
              <small><em>({t('Updating')})</em></small>
            </div>
          </div>

          <div>
            <span>{t('Paid out')}: </span>
            <span className="pt-product-price-value">0 VND</span>
            <div>
              <small><em></em></small>
            </div>
          </div>
        </div>

        <ReactTable
          data={this._data()}
          columns={[
            { Header: t('Time'), accessor: 'click_time' },
            {
              Header: t('Order ID'),
              id: 'order_id',
              Cell: ({ row }) => (
                <button className="btn btn-link" onClick={(e) => this.showModal(e, row)}>
                  {row._original.order_id}
                </button>
              )
            },
            {
              Header: t('Status'),
              id: 'status',
              accessor: (d) => <>
                <span className="badge badge-warning mr-1">{d.order_pending}</span>
                <span className="badge badge-success mr-1">{d.order_success}</span>
                <span className="badge badge-danger mr-1">{d.order_reject}</span>
              </>
            },
            { Header: t('Order value'), accessor: 'billing' },
            { Header: 'Cashback', accessor: 'pub_commission' },
            { Header: t('Website'), accessor: 'merchant' },
          ]}
          defaultPageSize={10}
          className="-striped -highlight bg-white shadow-sm text-center size-sm"
        />
        <Modal
          visible={this.state.modal}
          effect="fadeInUp"
          onClickAway={() => this.setState({ modal: false })}
        >
          <div>
            {this._getModalContent()}
          </div>
        </Modal>
      </>
    );
  }
}

const CashbackFormTranslated = withTranslation()(CashbackForm);
const SupportedProviderTranslated = withTranslation()(SupportedProvider);
const CashbackBalanceTranslated = withTranslation()(CashbackBalance);

class IndexComponent extends Component {
  render() {
    const { t } = this.props;

    if (typeof window === 'undefined') return null;
    return (
      <Layout>
        <div className="pt-hero">
          <HeadSlogan icon="checkmark" sub_headline={t('Cashback')} />
        </div>

        <div className="pt-card my-3 row">
          <div className="col mb-3" style={{ fontSize: 13 }}>
            {t('Cashback intro')}
                        <ul>
              <li>{t('Cashback note 1')}</li>
              <li>{t('Cashback note 2')}</li>
            </ul>
          </div>
          <div className="col mb-3">
            {!this.props.authUser ? <div className="text-danger text-sm">{t('Please sign in to use cashback')}</div> : <CashbackFormTranslated {...this.props} />}
          </div>
        </div>

        <CashbackBalanceTranslated />
        <SupportedProviderTranslated />

      </Layout>
    );
  }
}

const IndexComponentTranslated = withTranslation()(IndexComponent);

const IndexWithContext = (props) => <AuthUserContext.Consumer>
  {(authUser) => <IndexComponentTranslated authUser={authUser} {...props} />}
</AuthUserContext.Consumer>;

export default withAuthentication(IndexWithContext);

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
