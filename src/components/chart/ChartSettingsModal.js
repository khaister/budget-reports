import React from 'react';
import PropTypes from 'prop-types';

import { Button, Modal} from '../common';
import { SecondaryText } from '../common/typeComponents';

const ChartSettingsModal = ({
  open,
  monthsToCompare,
  onClose,
  onDecrementMonths,
  onIncrementMonths
}) => (
  <Modal open={open} title='Chart Settings' onClose={onClose}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ marginRight: 10 }}>
        <Button onClick={onDecrementMonths}>-</Button>
        <Button onClick={onIncrementMonths}>+</Button>
      </div>
      <SecondaryText>
        Compare with the last {monthsToCompare} month
        {monthsToCompare === 1 ? '' : 's'}
      </SecondaryText>
    </div>
  </Modal>
);

ChartSettingsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  monthsToCompare: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onDecrementMonths: PropTypes.func.isRequired,
  onIncrementMonths: PropTypes.func.isRequired
};

export default ChartSettingsModal;
