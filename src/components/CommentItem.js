// @flow
import React from 'react';
import Avatar from './Avatar';
import ConfirmBox from './ConfirmBox';
import Link from './Link';
import Dropdown from './Dropdown';
import CommentField from './CommentField';

import type {
  Comment,
  RemoveReactionCallbackFunction,
  RemoveChildReactionCallbackFunction,
  BaseActivityResponse,
} from '../types';

import { humanizeTimestamp, textRenderer } from '../utils';
import { withTranslationContext } from '../Context';
import type { Streami18Ctx } from '../Context';

export type Props = {|
  comment: Comment,
  activity: BaseActivityResponse,
  onRemoveReaction: RemoveReactionCallbackFunction,
  onRemoveChildReaction: RemoveChildReactionCallbackFunction,
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
      editComment: false,
      commentText: '',
    };
  }

  componentDidMount() {
    this.setState({ commentText: this.props.comment.data.text });
  }

  _user = () => {
    const { user } = this.props.comment;
    return user;
  };

  editComment = () => {
    this.setState({ editComment: true });
  };

  closeEditField = () => {
    this.setState({ editComment: false });
  };

  onUpdateComment = async (inText) => {
    await this.props.client.reactions.update(this.props.comment.id, {
      text: inText,
    });

    this.setState({
      //commentText: inText,
      editComment: false,
    });

    this.props.refresh();
  };

  onDeleteComment = async () => {
    try {
      if (this.props.postReaction) {
        await this.props.onRemoveChildReaction(
          'comment',
          this.props.postReaction,
          this.props.comment.id,
        );
      } else {
        await this.props.onRemoveReaction(
          'comment',
          this.props.activity,
          this.props.comment.id,
        );
      }

      this.props.refresh();
    } catch (e) {
      return;
    }

    this.closeConfirmDelete();
  };

  openConfirmDelete = () => {
    this.setState({ confirmDeleteOpen: true });
  };

  closeConfirmDelete = () => {
    this.setState({ confirmDeleteOpen: false });
  };

  render() {
    const { comment, tDateTimeParser, client } = this.props;

    return (
      <div className="mt-3">
        <div className="flex">
          <Avatar size={25} circle image={comment.user.data.profileImage} />
          <div className="ml-2">
            <div>
              <a
                className="font-bold"
                style={{ lineHeight: '25px' }}
                href={
                  this.props.linkUser
                    ? this.props.linkUser(comment.user.data.handle)
                    : '#'
                }
              >
                {comment.user.data.name}
              </a>
            </div>
            <div>
              {textRenderer(
                this.state.commentText,
                'raf-comment-item',
                this.props.linkMention,
                this.props.linkHashtag,
                this.props.linkBuild,
              )}
            </div>
          </div>
        </div>
        <div className="flex text-xs mt-1 text-gray-500">
          <div className="mr-6">
            {humanizeTimestamp(comment.created_at, tDateTimeParser)}
          </div>
          {comment.user_id === client.userId && (
            <div>
              <Dropdown more={true}>
                <div>
                  <Link
                    onClick={() => {
                      this.openConfirmDelete();
                    }}
                  >
                    Delete
                  </Link>
                </div>
                <div>
                  <Link
                    onClick={() => {
                      this.editComment();
                    }}
                  >
                    Edit
                  </Link>
                </div>
              </Dropdown>
            </div>
          )}
        </div>
        <ConfirmBox
          open={this.state.confirmDeleteOpen}
          confirmText="You wish to delete your reply?"
          onClose={this.closeConfirmDelete}
          onConfirm={this.onDeleteComment}
        />
        {this.state.editComment && (
          <div className="pt-2">
            <CommentField
              activity={this.props.postReaction}
              commentToEdit={comment}
              onUpdateComment={this.onUpdateComment}
              onClose={this.closeEditField}
              image={null}
            />
          </div>
        )}
      </div>
    );
  }
}

export default withTranslationContext(CommentItem);
