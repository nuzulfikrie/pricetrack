import React, { Component } from 'react';
import axios from 'axios';
import FlashMessage from 'react-flash-message';
import { withTranslation } from 'gatsby-plugin-react-i18next';

import { withAuthentication } from '../Session';

// TODO: bug in navigate's gastby
const navigate = (url) => {
  window.location = url;
  return true;
};

class AddUrlForm extends Component {
    state = { error: null, inputUrl: this.props.inputUrl || '', flashMessage: null }

    onChangeInput = (event) => {
      this.setState({ inputUrl: event.target.value });
    }

    onSubmit = (event) => {
      const { t } = this.props;
      const idToken = localStorage.getItem('authUserIdToken');

      if (!this.props.authUser || !this.props.authUser.email || !idToken) {
        this.showFlashMessage(t('Please sign in to add this URL'));
        navigate(`/view/${encodeURIComponent(this.state.inputUrl)}`);
      }

      const params = {
        idToken,
        url: this.state.inputUrl,
        email: this.props.authUser.email
      };
      axios.get('/api/addUrl', { params })
        .then((response) => {
          console.log(response);
          if (response.data) {
            navigate(`/view/${response.data.id}`);
          }
        })
        .catch((err) => {
          console.error(err);
          if (err.response) {
            const data = err.response.data || {};
            this.showFlashMessage(data.msg || t('Something went wrong, please try again later'));
            return;
          }

          this.showFlashMessage(err.msg || t('Something went wrong, please try again later'));
        });

      event.preventDefault();
    }

    showFlashMessage = (message) => {
      this.setState({ flashMessage: null }, () => this.setState({ flashMessage: message }));
    }

    render() {
      return (
            <form onSubmit={this.onSubmit}>
                <input className="pt-search-input" type="search"
                       placeholder="URL e.g. tiki.vn, shopee.vn"
                       onChange={this.onChangeInput}
                       value={this.state.inputUrl}
                       aria-label="URL" />

                {this.state.flashMessage
                  ? <FlashMessage duration={4000}>
                      <div className="pt-flash">{this.state.flashMessage}</div>
                    </FlashMessage>
                  : null}
            </form>
      );
    }
}

export default withAuthentication(withTranslation()(AddUrlForm));
