// @flow
import React from 'react';
import Avatar from './Avatar';
import Flex from './Flex';
import type { Comment } from '../types';

import { humanizeTimestamp, textRenderer } from '../utils';
import { withTranslationContext } from '../Context';
import type { Streami18Ctx } from '../Context';

export type Props = {|
  comment: Comment,
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
  _user = () => {
    const { user } = this.props.comment;
    return user;
  };

  render() {
    const { comment, tDateTimeParser } = this.props;
    return (
      <div className="raf-comment-item">
        <Flex a="flex-start" style={{ padding: '8px 0' }}>
          {comment.user.data.profileImage && (
            <Avatar image={comment.user.data.profileImage} circle size={25} />
          )}
        </Flex>
        <Flex d="column" style={{ flex: 1, margin: '0 8px' }}>
          <div className="raf-comment-item__content">
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
                    : ''
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
