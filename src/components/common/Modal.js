import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { StrongText } from './typeComponents';
import { PrimaryButton } from './Button';

const Container = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
`;

const ModalContent = styled.div`
  position: relative;
  min-width: 200px;
  padding: 15px 20px;
  margin-left: 20px;
  margin-right: 20px;
  background-color: #fff;
  border-radius: 2px;
  transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
`;

const ensureNextTick = callback =>
  requestAnimationFrame(() => {
    requestAnimationFrame(callback);
  });

class Modal extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    width: PropTypes.number
  };

  constructor() {
    super();
    this.el = document.createElement('div');
    this.state = { animationState: 'left' };
  }

  componentDidMount() {
    document.body.appendChild(this.el);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.open && this.props.open) {
      ensureNextTick(() => {
        this.setState({ animationState: 'entering' });
      });
    }
    if (prevProps.open && !this.props.open) {
      ensureNextTick(() => {
        this.setState({ animationState: 'leaving' });
      });
    }
  }

  componentWillUnmount() {
    document.body.removeChild(this.el);
  }

  handleTransitionEnd = () => {
    const { animationState } = this.state;

    if (animationState === 'entering') {
      this.setState({ animationState: 'entered' });
    } else if (animationState === 'leaving') {
      this.setState({ animationState: 'left' });
    }
  };

  render() {
    const { open, children, title, onClose, width } = this.props;
    const { animationState } = this.state;

    if (!open && animationState === 'left') {
      return null;
    }

    const shouldShow = ['entering', 'entered'].includes(animationState);

    return createPortal(
      <Container>
        <Overlay
          onClick={onClose}
          style={{ opacity: shouldShow ? 1 : 0 }}
          onTransitionEnd={this.handleTransitionEnd}
        />
        <ModalContent
          style={{
            opacity: shouldShow ? 1 : 0,
            transform: `translate3d(0, ${shouldShow ? '0' : '20px'}, 0)`,
            width
          }}
        >
          {title && (
            <StrongText style={{ marginBottom: 10 }}>{title}</StrongText>
          )}
          {children}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: 20
            }}
          >
            <PrimaryButton onClick={onClose}>Done</PrimaryButton>
          </div>
        </ModalContent>
      </Container>,
      this.el
    );
  }
}

export default Modal;
