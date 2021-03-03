// @flow

import React from 'react';
import Avatar from './Avatar';
import Button from './Button';
import Textarea from './Textarea';
import { inputValueFromEvent } from '../utils';
import scrollIntoView from 'scroll-into-view-if-needed';

import type {
  AddChildReactionCallbackFunction,
  BaseActivityResponse,
  Trigger,
} from '../types';
import { withTranslationContext } from '../Context';
import type { Streami18Ctx } from '../Context';
export type Props = {|
  activity: BaseActivityResponse,
  onAddReaction: AddChildReactionCallbackFunction,
  kind: string,
  placeholder: string,
  image?: string,
  onSuccess?: () => mixed,
  trigger?: Trigger,
|} & Streami18Ctx;

type State = {|
  text: string,
|};

/**
 * Component is described here.
 *
 * @example ./examples/CommentField.md
 */
class CommentField extends React.Component<Props, State> {
  textareaRef = React.createRef();

  state = {
    text: '',
  };

  onSubmitForm = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.state.text !== '') {
      let reaction = null;

      try {
        if (this.props.commentToEdit) {
          await this.props.onUpdateComment(this.state.text);
          reaction = this.props.commentToEdit;
        } else {
          reaction = await this.props.onAddReaction(
            'comment',
            this.props.activity,
            {
              text: this.state.text,
            },
          );
        }
      } catch (e) {
        return;
      }

      this.setState({ text: '' });

      if (this.props.onSuccess) {
        this.props.onSuccess(reaction);
      }
    }
  };

  _onChange = (event: SyntheticEvent<HTMLTextAreaElement> | Event) => {
    const text = inputValueFromEvent(event);
    if (text == null) {
      return;
    }
    this.setState({ text });
  };

  componentDidMount() {
    if (this.textareaRef.current) {
      this.textareaRef.current.addEventListener('keydown', (e) => {
        if (
          e.which === 13 &&
          this.textareaRef.current &&
          this.textareaRef.current.nextSibling === null
        ) {
          this.onSubmitForm(e);
        }
      });

      //this.textareaRef.current.scrollIntoView(false);
      scrollIntoView(this.textareaRef.current, {
        behavior: 'smooth',
        scrollMode: 'if-needed',
        block: 'center',
        inline: 'center',
      });
    }

    if (this.props.commentToEdit) {
      this.setState({ text: this.props.commentToEdit.data.text });
    }
  }

  render() {
    const { t, placeholder } = this.props;
    return (
      <form onSubmit={this.onSubmitForm} className="raf-comment-field">
        {this.props.image ? (
          <Avatar image={this.props.image} circle size={39} />
        ) : null}
        <div className="raf-comment-field__group">
          <Textarea
            rows={3}
            value={this.state.text}
            placeholder={placeholder || t('Start Typing...')}
            onChange={this._onChange}
            trigger={this.props.trigger}
            onPaste={() => null}
            maxLength={280}
            innerRef={this.textareaRef}
          />
          <div>
            <Button
              buttonStyle="primary"
              disabled={this.state.text === ''}
              type="submit"
            >
              {t('Post')}
            </Button>
            {this.props.commentToEdit && (
              <div className="mt-2">
                <Button
                  buttonStyle="faded"
                  disabled={this.state.text === ''}
                  type="button"
                  onClick={() => {
                    this.props.onClose();
                  }}
                >
                  {t('Cancel')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </form>
    );
  }
}

export default withTranslationContext(CommentField);
