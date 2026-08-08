import React, { Component } from 'react';
import axios from 'axios';
import { withTranslation } from 'gatsby-plugin-react-i18next';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const LogoOrDomain = ({ logo, domain }) => {
  if (logo) { return (<img src={logo} className="img-fluid" style={{ width: 100 }} title={domain} alt={domain} />); }
  return domain || null;
};

class CrawlerStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: {},
      info: {},
      credits: {},

      loading: false,
      error: false
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    axios.get('/api/about')
      .then((response) => {
        const { info, status, credits } = response.data;
        this.setState({
          info, status, credits, loading: false
        });
      })
      .catch((err) => {
        this.setState({ loading: false, error: true, err });
      });
  }


  render() {
    const { t } = this.props;

    if (this.state.loading) return t('Loading...');
    if (!this.state.status || !Object.keys(this.state.status).length) return t('No data');

    const active = <FontAwesomeIcon icon={faCheckCircle} color="green" />;
    const deactive = <FontAwesomeIcon icon={faTimesCircle} color="red" />;

    const _table = Object.values(this.state.status).map((domain) => (
      <tr key={domain.domain}>
        <th scope="row">
          <LogoOrDomain logo={domain.logo} domain={domain.domain} />
        </th>
        <td>{domain.time_check} {t('min')}</td>
        <td>{domain.active ? active : deactive}</td>
      </tr>
    ));

    return (
      <table className="pt-table">
        <thead>
          <tr>
            <th scope="col">{t('Service')}</th>
            <th scope="col">{t('Last updated')}</th>
            <th scope="col text-center">{t('Status')}</th>
          </tr>
        </thead>
        <tbody>{_table}</tbody>
      </table>
    );
  }
}

export default withTranslation()(CrawlerStatus);
