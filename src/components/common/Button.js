import styled from 'styled-components';

import { SecondaryText } from './typeComponents';
import { primaryColor } from '../../styleVariables';

const Button = styled(SecondaryText)`
  display: inline-block;
  user-select: none;
  border: 1px solid #ccc;
  padding: 4px 12px;
  border-radius: 2px;
  cursor: pointer;

  & + & {
    margin-left: 5px;
  }
`;

const PrimaryButton = styled(Button)`
  background-color: ${primaryColor};
  border-color: ${primaryColor};
  color: #fff;
`;

export {
  Button,
  PrimaryButton
};
