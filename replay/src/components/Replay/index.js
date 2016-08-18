import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { actionCreators } from 'redux-vcr.shared';
import VCR from '../VCR';
import CassetteList from '../CassetteList';
import Backdrop from '../Backdrop';

import './index.scss';


class ReduxVCR extends Component {
  componentDidMount() {
    this.props.cassettesListRequest();
  }

  render() {
    const {
      cassetteStatus,
      hideCassettes,
    } = this.props;

    return (
      <div className="redux-vcr-component">
        <VCR />

        { cassetteStatus === 'selecting' ? <CassetteList /> : null }

        <Backdrop
          isShown={cassetteStatus === 'selecting'}
          handleClickClose={hideCassettes}
          opacity={0.9}
          background="#FFF"
        />
      </div>
    );
  }
}

ReduxVCR.propTypes = {
  cassetteStatus: PropTypes.string.isRequired,
  hideCassettes: PropTypes.func,
  cassettesListRequest: PropTypes.func,
};

ReduxVCR.defaultProps = {
  position: 'bottom-left',
};

const mapStateToProps = state => ({
  cassetteStatus: state.reduxVCR.cassettes.status,
});


export default connect(
  mapStateToProps,
  {
    hideCassettes: actionCreators.hideCassettes,
    cassettesListRequest: actionCreators.cassettesListRequest,
  }
)(ReduxVCR);
