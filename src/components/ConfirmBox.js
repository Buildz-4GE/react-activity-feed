// @flow

import * as React from 'react';
import Modal from './Modal';
import Button from './Button';

type Props = {|
  children: React.Node,
  open: boolean,
  confirmHeading: String,
  confirmText: String,
  confirmButtonText: String,
  cancelButtonText: String,
  onClose: () => mixed,
  onConfirm: () => mixed,
|};

export default class ConfirmBox extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  static defaultProps = {
    open: false,
    confirmHeading: 'Confirm',
    confirmText: 'Do the thing?',
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    onClose: () => console.log('close confirm box...'),
    onConfirm: () => console.log('you confirmed...'),
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
              {this.props.confirmHeading}
            </h3>
            <div>{this.props.confirmText}</div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <Button
                buttonStyle="primary"
                onClick={() => {
                  this.props.onConfirm();
                }}
              >
                {this.props.confirmButtonText}
              </Button>
              <Button
                buttonStyle="faded"
                onClick={() => {
                  this.props.onClose();
                }}
              >
                {this.props.cancelButtonText}
              </Button>
            </div>
          </div>
        </Modal>
      );
    }
    return null;
  }
}
