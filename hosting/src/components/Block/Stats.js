import React, { Component } from 'react';
import axios from 'axios';
import { withTranslation } from 'gatsby-plugin-react-i18next';

class Stats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statistics: {},

      loading: false,
      error: false
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    axios.get('/api/about')
      .then((response) => {
        const { statistics } = response.data;
        this.setState({ statistics, loading: false });
      })
      .catch((err) => {
        console.error(err);
        this.setState({ loading: false, error: true });
      });
  }

  render() {
    const { t } = this.props;

    if (this.state.loading) return t('Loading...');
    if (!Object.keys(this.state.statistics).length) return t('No data');

    return (
      <table className="pt-table">
        <tbody>
          <tr>
              <td style={{ textAlign: 'right' }}>{t('Number of tracked products')}</td>
              <td>{this.state.statistics.url_count}</td>
          </tr>

          <tr>
              <td style={{ textAlign: 'right' }}>{t('Number of price updates')}</td>
              <td>{this.state.statistics.num_url_cronjob_triggered}</td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default withTranslation()(Stats);
