// NavLinks for mobile browser
// Use ReactDOM Portal to render SideDrawer
import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import './SideDrawer.css';

const SideDrawer = (props) => {
  // Use CSSTransition for SideDrawer Animation
  const content = (
    <CSSTransition
      in={props.show}
      timeout={200}
      classNames="slide-in-left" //defined in index.css
      mountOnEnter
      unmountOnExit
    >
      <aside className="side-drawer" onClick={props.onClick}>
        {props.children}
      </aside>
    </CSSTransition>
  );

  return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));
};

export default SideDrawer;
