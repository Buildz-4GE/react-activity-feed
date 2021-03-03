// @flow

import * as React from 'react';
import Modal from './Modal';
import Button from './Button';

type Props = {|
  children: React.Node,
  open: boolean,
  alertHeading: String,
  alertText: String,
  alertButtonText: String,
  onClose: () => mixed,
|};

export default class AlertBox extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  static defaultProps = {
    open: false,
    alertHeading: 'Alert',
    alertText: 'Its an alert!',
    alertButtonText: 'Okay',
    onClose: () => console.log('close alert box...'),
  };

  render() {
    if (this.props.open) {
      return (
        <Modal open={this.props.open} onClose={this.props.onClose}>
          <div
            className="bg-white rounded-md shadow-xs p-6 text-gray-700 m-auto"
            style={{ width: '400px', maxWidth: '95%' }}
          >
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-3">
              {this.props.alertHeading}
            </h3>
            <div>{this.props.alertText}</div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <Button
                buttonStyle="primary"
                onClick={() => {
                  this.props.onClose();
                }}
              >
                {this.props.alertButtonText}
              </Button>
            </div>
          </div>
        </Modal>
      );
    }
    return null;
  }
}
