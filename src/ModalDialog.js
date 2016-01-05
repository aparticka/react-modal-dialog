import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import dynamics from 'dynamics.js';
import centerComponent from 'react-center-component';
import useSheet from './useSheet';
import CloseCircle from './CloseCircle';
import EventStack from 'active-event-stack';
import keycode from 'keycode';

// This decorator centers the dialog
@centerComponent
@useSheet({
  dialog: {
    boxSizing: 'border-box',
    position: 'relative',
    background: 'white',
    padding: 20,
    color: '#333',
    boxShadow: '0px 2px 15px rgba(0, 0, 0, 0.4)',
    borderRadius: 10,
  },
  'closeButton': {
    position: 'absolute',
    top: 0,
    left: -50,
    display: 'block',
    width: 40,
    height: 40,
    transition: 'transform 0.1s',
    // backgroundImage: require('../images/modal-dialog-close.png'),
    // backgroundRepeat: 'no-repeat',
    // backgroundSize: '40px 40px',
    '&:hover': {
      transform: 'scale(1.1)',
    },
    cursor: 'pointer'
  },
})
export default class ModalDialog extends React.Component {
  static propTypes = {
    onClose: PropTypes.func, // required for the close button
    className: PropTypes.string, // css class in addition to .ReactModalDialog
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // width
    topOffset: PropTypes.number, // injected by @centerComponent
    leftOffset: PropTypes.number, // injected by @centerComponent
    margin: PropTypes.number.isRequired, // the margin around the dialog
    children: PropTypes.node,
    componentIsLeaving: PropTypes.bool,
    style: PropTypes.object,
    sheet: PropTypes.object,
    closeBackgroundFill: PropTypes.string,
    closeXFill: PropTypes.string
  }
  static defaultProps = {
    width: 'auto',
    margin: 20,
  }
  componentWillMount = () => {
    /**
     * This is done in the componentWillMount instead of the componentDidMount
     * because this way, a modal that is a child of another will have register
     * for events after its parent
     */
    this.eventToken = EventStack.addListenable([
      ['keydown', this.handleGlobalKeydown],
    ]);
  }
  componentWillUnmount = () => {
    EventStack.removeListenable(this.eventToken);
  }
  shouldClickDismiss = (event) => {
    const {target} = event;
    // This piece of code isolates targets which are fake clicked by things
    // like file-drop handlers
    if (target.tagName === 'INPUT' && target.type === 'file') {
      return false;
    }

    if (target === this.refs.self || this.refs.self.contains(target)) return false;
    return true;
  }
  handleGlobalKeydown = (event) => {
    if (keycode(event) == 'esc') {
      if (typeof this.props.onClose == 'function') {
        this.props.onClose();
      }
    }
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.componentIsLeaving && !this.props.componentIsLeaving) {
      const node = ReactDOM.findDOMNode(this);
      dynamics.animate(node, {
        scale: 1.2,
        opacity: 0,
      }, {
        duration: 300,
        type: dynamics.easeIn,
      });
    }
  }
  componentDidMount = () => {
    // Animate this node once it is mounted
    const node = ReactDOM.findDOMNode(this);

    if (document.body.style.transform == undefined) {
      node.style.WebkitTransform = 'scale(0.5)';
    } else {
      node.style.transform = 'scale(0.5)';
    }

    dynamics.animate(node, {
      scale: 1,
    }, {
      type: dynamics.spring,
      duration: 500,
      friction: 400,
    });
  }
  render = () => {
    const {
      props: {
        topOffset,
        leftOffset,
        width,
        className,
        children,
        onClose,
        margin,
        style,
        sheet: {
          classes,
        },
        closeBackgroundFill,
        closeXFill,
        ...rest,
      },
    } = this;

    const dialogStyle = {
      position: 'absolute',
      marginBottom: margin,
      width: width,
      top: Math.max(topOffset, margin),
      left: leftOffset,
      ...style,
    };

    const divClassName = classNames(classes.dialog, className);

    return <div {...rest}
      ref="self"
      className={divClassName}
      style={dialogStyle}
    >
      {
        onClose ?
        <a className={classes.closeButton} onClick={onClose}>
          <CloseCircle backgroundFill={closeBackgroundFill} diameter={40} xFill={closeXFill}/>
        </a> :
        null
      }
      {children}
    </div>;
  }
}
