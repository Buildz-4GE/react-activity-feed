// @flow
import React from 'react';
import Avatar from './Avatar';
import Flex from './Flex';
import Modal from './Modal';
import Link from './Link';
import Button from './Button';

import type {
  Comment,
  RemoveReactionCallbackFunction,
  BaseActivityResponse,
} from '../types';

import { humanizeTimestamp, textRenderer } from '../utils';
import { withTranslationContext } from '../Context';
import type { Streami18Ctx } from '../Context';

export type Props = {|
  comment: Comment,
  activity: BaseActivityResponse,
  onRemoveReaction: RemoveReactionCallbackFunction,
  kind: string,
  /** Handler for any routing you may do on clicks on Hashtags */
  linkHashtag?: (word: string) => mixed,
  /** Handler for any routing you may do on clicks on Mentions */
  linkMention?: (word: string) => mixed,
  linkBuild?: (word: string) => mixed,
  linkUser?: (word: string) => mixed,
|} & Streami18Ctx;

/**
 * Component is described here.
 *
 * @example ./examples/CommentItem.md
 */
class CommentItem extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.state = {
      confirmDeleteOpen: false,
    };
  }
  _user = () => {
    const { user } = this.props.comment;
    return user;
  };

  onDeleteComment = async () => {
    try {
      await this.props.onRemoveReaction(
        'comment',
        this.props.activity,
        this.props.comment.id,
      );
    } catch (e) {
      return;
    }

    this.closeConfirmDelete();
  };

  openConfirmDelete() {
    this.setState({ confirmDeleteOpen: true });
  }

  closeConfirmDelete() {
    this.setState({ confirmDeleteOpen: false });
  }

  render() {
    const { comment, tDateTimeParser, client } = this.props;

    return (
      <div className="raf-comment-item relative">
        {comment.user_id === client.userId && (
          <React.Fragment>
            <div
              className="absolute top-0 right-0 mr-3 mt-4 text-gray-400 cursor-pointer"
              alt="Delete comment"
            >
              <Link
                onClick={() => {
                  this.openConfirmDelete();
                }}
              >
                <svg
                  className="w-3 h-3 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z" />
                </svg>
              </Link>
            </div>
            <Modal open={this.state.confirmDeleteOpen}>
              <div
                className="bg-white rounded-md shadow-xs p-6 text-gray-700 m-auto"
                style={{ width: '400px', maxWidth: '95%' }}
              >
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-3">
                  Confirm
                </h3>
                <div>You wish to delete your comment?</div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <Button
                    buttonStyle="primary"
                    onClick={() => {
                      this.onDeleteComment();
                    }}
                  >
                    Confirm
                  </Button>
                  <Button
                    buttonStyle="faded"
                    onClick={() => {
                      this.closeConfirmDelete();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Modal>
          </React.Fragment>
        )}
        <Flex a="flex-start" style={{ padding: '8px 0' }}>
          {comment.user.data.profileImage && (
            <Avatar image={comment.user.data.profileImage} circle size={25} />
          )}
        </Flex>
        <Flex d="column" style={{ flex: 1, margin: '0 8px' }}>
          <div className="raf-comment-item__content pr-2">
            <time dateTime={comment.created_at} title={comment.created_at}>
              <small>
                {humanizeTimestamp(comment.created_at, tDateTimeParser)}
              </small>
            </time>
            <p>
              <a
                href={
                  this.props.linkUser
                    ? this.props.linkUser(comment.user.data.handle)
                    : '#'
                }
                className="raf-comment-item__author"
              >
                {comment.user.data.name}
              </a>{' '}
              {textRenderer(
                comment.data.text,
                'raf-comment-item',
                this.props.linkMention,
                this.props.linkHashtag,
                this.props.linkBuild,
              )}
            </p>
          </div>
        </Flex>
      </div>
    );
  }
}

export default withTranslationContext(CommentItem);
