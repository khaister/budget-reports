import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';
import { matchPath } from 'react-router';
import styled from 'styled-components';

import pages, { makeLink } from '../../pages';
import { Icon } from '../common';
import { selectedPlotBandColor, iconWidth } from '../../styleVariables';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  height: 60px;
`;

const IconWrapper = styled.div`
  width: ${iconWidth}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledLink = styled(NavLink)`
  color: inherit;
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  background-color: ${props => props.active && selectedPlotBandColor};
`;

class SidebarMenuContent extends PureComponent {
  static propTypes = {
    budgetId: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    onCloseSidebar: PropTypes.func.isRequired
  };

  render() {
    const { budgetId, location, onCloseSidebar } = this.props;

    return (
      <Fragment>
        <PureHeader onCloseSidebar={onCloseSidebar} budgetId={budgetId} />
        {[
          'currentMonth',
          'groups',
          'income',
          'incomeVsExpenses',
          'netWorth',
          'investments',
          'projections'
        ].map(page => {
          const { path, title } = pages[page];

          return (
            <PureStyledLink
              key={path}
              to={makeLink(path, { budgetId })}
              active={matchPath(location, { path })}
              onClick={onCloseSidebar}
            >
              {title}
            </PureStyledLink>
          );
        })}
        {(
          <PureStyledLink to='/budgets'>Switch Budgets</PureStyledLink>
        )}
      </Fragment>
    );
  }
}

class PureHeader extends PureComponent {
  render() {
    const { onCloseSidebar, budgetId } = this.props;
    return (
      <Header>
        <IconWrapper onClick={onCloseSidebar}>
          <Icon icon='times' />
        </IconWrapper>
        <Link
          to={makeLink(pages.settings.path, { budgetId })}
          style={{ display: 'flex', color: 'inherit' }}
          onClick={onCloseSidebar}
        >
          <IconWrapper>
            <Icon icon='cog' />
          </IconWrapper>
        </Link>
      </Header>
    );
  }
}

class PureStyledLink extends PureComponent {
  render() {
    return <StyledLink {...this.props} />;
  }
}

export default SidebarMenuContent;
