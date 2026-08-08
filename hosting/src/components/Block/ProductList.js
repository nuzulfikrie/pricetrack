import PropTypes from 'prop-types';
import React from 'react';
import { Link, withTranslation } from 'gatsby-plugin-react-i18next';
import { OutboundLink as A } from 'gatsby-plugin-google-gtag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHistory, faCaretDown, faCaretUp, faShoppingCart,
  faUser, faHandPointer, faClock, faRotate
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

import LogoPlaceHolder from './LogoPlaceHolder';
import { formatPrice, openDeepLink } from '../../utils';

class ProductList extends React.Component {
  renderItem(url) {
    const { t } = this.props;

    return (
        <div className="pt-product-item" key={url.url}>
          <div className="pt-product-logo-col">
              <LogoPlaceHolder className="pt-product-logo" url={url} />
              <A className="d-block d-sm-none mt-1" href={url.url} onClick={(e) => { openDeepLink(url.redirect); e.preventDefault(); }}>
                  <img className="img-fluid" style={{ width: 40 }} src={url.domain_logo} alt="" />
              </A>
          </div>

          <div className="pt-product-body">
              <div className="pt-product-title">
                  { url.inventory_status === false
                    ? <span className="pt-badge pt-badge-danger mr-1">{t('Out of stock')}</span>
                    : '' }

                  <Link to={`/view/${url.id}`}>
                  {url.info ? url.info.name : url.domain}
                  </Link>
              </div>

              <div className="pt-product-price">
                  <span className="pt-product-price-value">{formatPrice(url.latest_price, false, url.info.currency)} </span>
                  {
                      url.price_change
                        ? <span className={`pt-product-price-change ${url.price_change < 0 ? 'pt-price-down' : 'pt-price-up'}`}>
                              <FontAwesomeIcon
                                icon={url.price_change < 0 ? faCaretDown : faCaretUp } />
                              {formatPrice(url.price_change, true, url.info.currency)}
                          </span>
                        : ''
                  }
              </div>

              <A className="pt-product-url" href={url.url} onClick={(e) => { openDeepLink(url.redirect); e.preventDefault(); }}>
                  {url.url.length > 100 ? `${url.url.slice(0, 100)}...` : url.url}
              </A>

              <div className="pt-product-actions">
                <A href={url.url} className='pt-btn pt-btn-primary pt-btn-sm'
                    onClick={(e) => { openDeepLink(url.redirect); e.preventDefault(); }}>
                    <FontAwesomeIcon icon={faShoppingCart} /> {t('Go to')} {url.domain}
                </A>
                <Link className='pt-btn pt-btn-secondary pt-btn-sm' to={`/view/${url.id}`}>
                    <FontAwesomeIcon icon={faHistory} /> {t('Price history')}
                </Link>
              </div>

              <div className="pt-product-meta">
                  <A href={`/view/${url.id}`} className="pt-meta-item">
                      <FontAwesomeIcon icon={faUser} /> {url.add_by}
                  </A>
                  {url.deeplinkClick
                    ? <span className="pt-meta-item">
                          <FontAwesomeIcon icon={faHandPointer} />
                          {' '}{url.deeplinkClick} click{url.deeplinkClick > 1 ? 's' : ''}
                      </span>
                    : ''}
                  <span className="pt-meta-item">
                      <FontAwesomeIcon icon={faClock} />
                      {' '}{t('Added')} {moment(url.created_at).fromNow()}
                  </span>
                  <span className="pt-meta-item">
                      <FontAwesomeIcon icon={faRotate} />
                      {' '}{t('Updated')} {url.last_pull_at && moment(url.last_pull_at).isValid() ? moment(url.last_pull_at).fromNow() : t('not updated yet')}
                  </span>
              </div>
          </div>

          <div className="pt-product-domain-logo">
            <Link to={url.url} onClick={(e) => { openDeepLink(url.redirect); e.preventDefault(); }}>
                <img className="img-fluid" src={url.domain_logo} alt="" />
            </Link>
          </div>
        </div>
    );
  }

  render() {
    const { t } = this.props;

    if (!this.props.urls.length) return t('No items');

    const isGrid = this.props.view === 'grid';
    const containerClass = isGrid ? 'pt-product-grid' : 'pt-product-list';

    return (
        <React.Fragment>
            <div className={containerClass}>
                {this.props.urls.map((url) => this.renderItem(url))}
            </div>

            {this.props.loadMore
              ? <div className="pt-load-more-wrap">
                    <span className="pt-btn pt-btn-secondary"
                        onClick={this.props.onClickLoadMore}
                        key="load-more-btn">
                        {t('Load more')}
                    </span>
                </div>
              : ''}
        </React.Fragment>
    );
  }
}

ProductList.propTypes = {
  urls: PropTypes.array.isRequired,
  view: PropTypes.string
};
ProductList.defaultProps = {
  loadMore: true,
  view: 'list'
};

export default withTranslation()(ProductList);
