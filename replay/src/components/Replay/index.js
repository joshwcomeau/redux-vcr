import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import * as actionCreators from '../../../../shared/actions';
import VCR from '../VCR';
import CasetteList from '../CasetteList';
import Backdrop from '../Backdrop';

import './index.scss';


class ReduxVCR extends Component {
  componentDidMount() {
    this.props.casettesListRequest();
  }

  render() {
    const {
      casetteStatus,
      hideCasettes,
    } = this.props;

    return (
      <div className="redux-vcr-component">
        <VCR />
        { casetteStatus === 'selecting' ? <CasetteList /> : null }
        <Backdrop
          isShown={casetteStatus === 'selecting'}
          handleClickClose={hideCasettes}
          opacity={0.9}
          background="#FFF"
        />
      </div>
    );
  }
}

ReduxVCR.propTypes = {
  casetteStatus: PropTypes.string,
  hideCasettes: PropTypes.func,
  casettesListRequest: PropTypes.func,
};

ReduxVCR.defaultProps = {
  position: 'bottom-left',
};

const mapStateToProps = state => ({
  casetteStatus: state.reduxVCR.casettes.status,
});


export default connect(
  mapStateToProps,
  {
    hideCasettes: actionCreators.hideCasettes,
    casettesListRequest: actionCreators.casettesListRequest,
  }
)(ReduxVCR);
