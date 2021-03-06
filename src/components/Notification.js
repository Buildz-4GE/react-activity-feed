// @flow
import React from 'react';
import Avatar from './Avatar';
import AvatarGroup from './AvatarGroup';
import AttachedActivity from './AttachedActivity';
import Dropdown from './Dropdown';
import Link from './Link';

import { humanizeTimestamp, userOrDefault } from '../utils';
import type { UserResponse, BaseActivityGroupResponse } from '../types';
import type { Streami18Ctx } from '../Context';
import { withTranslationContext } from '../Context';

type Props = {
  /* The activity group to display in this notification */
  activityGroup: any,
  /* Callback to call when clicking on a notification */
  onClickNotification?: (activityGroup: BaseActivityGroupResponse) => mixed,
  /* Callback to call when clicking on a user in the notification */
  onClickUser?: (UserResponse) => mixed,
  /* Callback to mark a notification as read, if not supplied the dropdown used
   * to mark as read will not be shown */
  onMarkAsRead?: ?(
    group:
      | true
      | BaseActivityGroupResponse
      | $ReadOnlyArray<BaseActivityGroupResponse>,
  ) => Promise<mixed>,
} & Streami18Ctx;

/**
 * Component is described here.
 *
 * @example ./examples/Notification.md
 */
class Notification extends React.Component<Props> {
  getUsers = (activities: any) =>
    activities.map((item) => userOrDefault(item.actor));

  _getOnClickUser(actor: UserResponse) {
    return this.props.onClickUser
      ? (e: SyntheticEvent<>) => this.onClickUser(e, actor)
      : undefined;
  }

  suspendNotifies = (e, latestActivity) => {
    e.stopPropagation();
    this.props.noNotifies(latestActivity.id);
  };

  onClickUser = (e: SyntheticEvent<>, actor: any) => {
    const { onClickUser } = this.props;
    if (onClickUser) {
      e.stopPropagation();
      return onClickUser(userOrDefault(actor));
    }
  };

  _getOnClickNotification() {
    return this.props.onClickNotification
      ? this.onClickNotification
      : undefined;
  }

  onClickNotification = (e: SyntheticEvent<>) => {
    const { onClickNotification } = this.props;
    if (onClickNotification) {
      e.stopPropagation();
      return onClickNotification(this.props.activityGroup);
    }
  };

  singleUser = (latestActivity, lastActor, t) => {
    let headerText = '';

    switch (latestActivity.verb) {
      case 'like':
        headerText = t('{{ actorName }} liked your {{ activityVerb }}', {
          actorName: lastActor.data.name,
          activityVerb: latestActivity.object.verb,
        });
        break;
      case 'activityLike':
        headerText = t('{{ actorName }} liked your post', {
          actorName: lastActor.data.name,
        });
        break;
      case 'postReactionLike':
        headerText = t('{{ actorName }} liked your comment', {
          actorName: lastActor.data.name,
        });
        break;
      case 'repost':
        headerText = t('{{ actorName }} reposted your {{ activityVerb }}', {
          actorName: lastActor.data.name,
          activityVerb: latestActivity.object.verb,
        });
        break;
      case 'follow':
        headerText = t('{{ actorName }} started following you', {
          actorName: lastActor.data.name,
        });
        break;
      case 'post':
        if (
          latestActivity.meta &&
          latestActivity.meta['build_owners'] &&
          latestActivity.meta['build_owners'].includes(this.props.userId)
        ) {
          headerText = t('{{ actorName }} made a post on your build.', {
            actorName: lastActor.data.name,
          });
        } else if (
          latestActivity.meta &&
          latestActivity.meta['garage_owner'] &&
          parseInt(latestActivity.meta['garage_owner']) === this.props.userId
        ) {
          headerText = t('{{ actorName }} made a post on your garage.', {
            actorName: lastActor.data.name,
          });
        } else {
          headerText = t('{{ actorName }} mentioned you in a post.', {
            actorName: lastActor.data.name,
          });
        }

        break;
      case 'comment':
        if (
          latestActivity.meta &&
          latestActivity.meta['reaction_owner'] &&
          parseInt(latestActivity.meta['reaction_owner']) === this.props.userId
        ) {
          headerText = t('{{ actorName }} replied to your comment.', {
            actorName: lastActor.data.name,
          });
        } else if (latestActivity.meta['activity_owner_label']) {
          headerText = t(
            '{{ actorName }} replied to a comment on {{ ownerLabel }} post.',
            {
              actorName: lastActor.data.name,
              ownerLabel: latestActivity.meta['activity_owner_label'],
            },
          );
        } else {
          headerText = t('{{ actorName }} replied to a comment.', {
            actorName: lastActor.data.name,
          });
        }

        break;
      case 'reaction':
        if (
          latestActivity.meta &&
          latestActivity.meta['activity_owner'] &&
          parseInt(latestActivity.meta['activity_owner']) === this.props.userId
        ) {
          headerText = t('{{ actorName }} commented on your post.', {
            actorName: lastActor.data.name,
          });
        } else if (
          latestActivity.meta &&
          latestActivity.meta['users'] &&
          latestActivity.meta['users'].includes(this.props.userId)
        ) {
          headerText = t('{{ actorName }} mentioned you in a comment.', {
            actorName: lastActor.data.name,
          });
        } else if (latestActivity.meta['activity_owner_label']) {
          headerText = t(
            '{{ actorName }} also commented on {{ ownerLabel }} post.',
            {
              actorName: lastActor.data.name,
              ownerLabel: latestActivity.meta['activity_owner_label'],
            },
          );
        } else {
          headerText = t('{{ actorName }} commented on a post.', {
            actorName: lastActor.data.name,
          });
        }

        break;
      default:
        console.warn(
          'No notification styling found for your verb, please create your own custom Notification group.',
        );
    }

    return headerText;
  };

  twoUsers = (latestActivity, lastActor, t) => {
    let headerText = '';

    switch (latestActivity.verb) {
      case 'like':
        headerText = t(
          '{{ actorName }} and 1 other liked your {{ activityVerb }}',
          {
            actorName: lastActor.data.name,
            activityVerb: latestActivity.object.verb,
          },
        );
        break;
      case 'activityLike':
        headerText = t('{{ actorName }} and 1 other liked your post', {
          actorName: lastActor.data.name,
        });
        break;
      case 'postReactionLike':
        headerText = t('{{ actorName }} and 1 other liked your comment', {
          actorName: lastActor.data.name,
        });
        break;
      case 'repost':
        headerText = t(
          '{{ actorName }} and 1 other reposted your {{ activityVerb }}',
          {
            actorName: lastActor.data.name,
            activityVerb: latestActivity.object.verb,
          },
        );
        break;
      case 'follow':
        headerText = t('{{ actorName }} and 1 other started following you', {
          actorName: lastActor.data.name,
        });
        break;
      case 'comment':
        if (
          latestActivity.meta &&
          latestActivity.meta['reaction_owner'] &&
          parseInt(latestActivity.meta['reaction_owner']) === this.props.userId
        ) {
          headerText = t(
            '{{ actorName }} and 1 other replied to your comment.',
            {
              actorName: lastActor.data.name,
            },
          );
        } else if (latestActivity.meta['activity_owner_label']) {
          headerText = t(
            '{{ actorName }} and 1 other replied to a comment on {{ ownerLabel }} post.',
            {
              actorName: lastActor.data.name,
              ownerLabel: latestActivity.meta['activity_owner_label'],
            },
          );
        } else {
          headerText = t('{{ actorName }} and 1 other replied to a comment.', {
            actorName: lastActor.data.name,
          });
        }

        break;
      case 'reaction':
        if (
          latestActivity.meta &&
          latestActivity.meta['activity_owner'] &&
          parseInt(latestActivity.meta['activity_owner']) === this.props.userId
        ) {
          headerText = t(
            '{{ actorName }} and 1 other commented on your post.',
            {
              actorName: lastActor.data.name,
            },
          );
        } else if (
          latestActivity.meta &&
          latestActivity.meta['users'] &&
          latestActivity.meta['users'].includes(this.props.userId)
        ) {
          headerText = t(
            '{{ actorName }} and 1 other mentioned you in a post.',
            {
              actorName: lastActor.data.name,
            },
          );
        } else if (latestActivity.meta['activity_owner_label']) {
          headerText = t(
            '{{ actorName }} and 1 other also commented on {{ ownerLabel }} post.',
            {
              actorName: lastActor.data.name,
              ownerLabel: latestActivity.meta['activity_owner_label'],
            },
          );
        } else {
          headerText = t('{{ actorName }} and 1 other commented on a post.', {
            actorName: lastActor.data.name,
          });
        }

        break;
      case 'post':
        if (
          latestActivity.meta &&
          latestActivity.meta['build_owners'] &&
          latestActivity.meta['build_owners'].includes(this.props.userId)
        ) {
          headerText = t(
            '{{ actorName }} and 1 other made a post on your build.',
            {
              actorName: lastActor.data.name,
            },
          );
        } else if (
          latestActivity.meta &&
          latestActivity.meta['garage_owner'] &&
          parseInt(latestActivity.meta['garage_owner']) === this.props.userId
        ) {
          headerText = t(
            '{{ actorName }} and 1 other made a post on your garage.',
            {
              actorName: lastActor.data.name,
            },
          );
        } else {
          headerText = t(
            '{{ actorName }} and 1 other mentioned you in a post.',
            {
              actorName: lastActor.data.name,
            },
          );
        }
        break;
      default:
        console.warn(
          'No notification styling found for your verb, please create your own custom Notification group.',
        );
    }

    return headerText;
  };

  multiUsers = (latestActivity, lastActor, countOtherActors, t) => {
    let headerText = '';

    switch (latestActivity.verb) {
      case 'like':
        headerText = t(
          '{{ actorName }} and {{ countOtherActors }} others liked your {{ activityVerb }}',
          {
            actorName: lastActor.data.name,
            activityVerb: latestActivity.object.verb,
            countOtherActors,
          },
        );
        break;
      case 'activityLike':
        headerText = t(
          '{{ actorName }} and {{ countOtherActors }} others liked your post',
          {
            actorName: lastActor.data.name,
            countOtherActors,
          },
        );
        break;
      case 'postReactionLike':
        headerText = t(
          '{{ actorName }} and {{ countOtherActors }} others liked your comment',
          {
            actorName: lastActor.data.name,
            countOtherActors,
          },
        );
        break;
      case 'repost':
        headerText = t(
          '{{ actorName }} and {{ countOtherActors }} others reposted your {{ activityVerb }}',
          {
            actorName: lastActor.data.name,
            activityVerb: latestActivity.object.verb,
            countOtherActors,
          },
        );
        break;
      case 'follow':
        headerText = t(
          '{{ actorName }} and {{ countOtherActors }} others started following you',
          {
            actorName: lastActor.data.name,
            countOtherActors,
          },
        );
        break;
      case 'comment':
        if (
          latestActivity.meta &&
          latestActivity.meta['reaction_owner'] &&
          parseInt(latestActivity.meta['reaction_owner']) === this.props.userId
        ) {
          headerText = t(
            '{{ actorName }} and {{ countOtherActors }} others replied to your comment.',
            {
              actorName: lastActor.data.name,
              countOtherActors,
            },
          );
        } else if (latestActivity.meta['activity_owner_label']) {
          headerText = t(
            '{{ actorName }} and {{ countOtherActors }} others replied to a comment on {{ ownerLabel }} post.',
            {
              actorName: lastActor.data.name,
              ownerLabel: latestActivity.meta['activity_owner_label'],
              countOtherActors,
            },
          );
        } else {
          headerText = t(
            '{{ actorName }} and {{ countOtherActors }} others replied to a comment.',
            {
              actorName: lastActor.data.name,
              countOtherActors,
            },
          );
        }

        break;
      case 'reaction':
        if (
          latestActivity.meta &&
          latestActivity.meta['activity_owner'] &&
          parseInt(latestActivity.meta['activity_owner']) === this.props.userId
        ) {
          headerText = t(
            '{{ actorName }} and {{ countOtherActors }} others commented on your post.',
            {
              actorName: lastActor.data.name,
              countOtherActors,
            },
          );
        } else if (
          latestActivity.meta &&
          latestActivity.meta['users'] &&
          latestActivity.meta['users'].includes(this.props.userId)
        ) {
          headerText = t(
            '{{ actorName }} and {{ countOtherActors }} others mentioned you in a post.',
            {
              actorName: lastActor.data.name,
              countOtherActors,
            },
          );
        } else if (latestActivity.meta['activity_owner_label']) {
          headerText = t(
            '{{ actorName }} and {{ countOtherActors }} others also commented on {{ ownerLabel }} post.',
            {
              actorName: lastActor.data.name,
              ownerLabel: latestActivity.meta['activity_owner_label'],
              countOtherActors,
            },
          );
        } else {
          headerText = t(
            '{{ actorName }} and {{ countOtherActors }} others commented on a post.',
            {
              actorName: lastActor.data.name,
              countOtherActors,
            },
          );
        }

        break;
      case 'post':
        if (
          latestActivity.meta &&
          latestActivity.meta['build_owners'] &&
          latestActivity.meta['build_owners'].includes(this.props.userId)
        ) {
          headerText = t(
            '{{ actorName }} and {{ countOtherActors }} others made a post on your build.',
            {
              actorName: lastActor.data.name,
              countOtherActors,
            },
          );
        } else if (
          latestActivity.meta &&
          latestActivity.meta['garage_owner'] &&
          parseInt(latestActivity.meta['garage_owner']) === this.props.userId
        ) {
          headerText = t(
            '{{ actorName }} and {{ countOtherActors }} others made a post on your garage.',
            {
              actorName: lastActor.data.name,
              countOtherActors,
            },
          );
        } else {
          headerText = t(
            '{{ actorName }} and {{ countOtherActors }} others mentioned you in a post.',
            {
              actorName: lastActor.data.name,
              countOtherActors,
            },
          );
        }
        break;
      default:
        console.warn(
          'No notification styling found for your verb, please create your own custom Notification group.',
        );
    }

    return headerText;
  };

  render() {
    let headerText, headerSubtext;
    const { activityGroup, t, tDateTimeParser } = this.props;
    const activities = activityGroup.activities;
    const latestActivity = activities[0];
    const lastActor = userOrDefault(latestActivity.actor);

    if (
      typeof latestActivity.object === 'string' &&
      latestActivity.meta &&
      latestActivity.meta['original_id']
    ) {
      latestActivity.id = latestActivity.meta['original_id'];
    }

    if (activities.length === 1) {
      headerText = this.singleUser(latestActivity, lastActor, t);
    } else if (activities.length > 1 && activities.length < 1 + 1 + 1) {
      headerText = this.twoUsers(latestActivity, lastActor, t);
    } else {
      headerText = this.multiUsers(
        latestActivity,
        lastActor,
        activities.length - 1,
        t,
      );
    }

    return (
      <div
        onClick={this._getOnClickNotification()}
        className={
          'raf-notification relative' +
          (activityGroup.is_read ? ' raf-notification--read' : '')
        }
      >
        <Avatar
          onClick={this._getOnClickUser(lastActor)}
          image={lastActor.data.profileImage}
          circle
          size={30}
        />
        <div className="raf-notification__content">
          <div className="raf-notification__header">
            <strong>{headerText}</strong> {headerSubtext}
          </div>
          <div>
            <small>
              {humanizeTimestamp(latestActivity.time, tDateTimeParser)}
            </small>
          </div>
          {latestActivity.verb !== 'follow' ? (
            <AttachedActivity activity={latestActivity.object} />
          ) : null}
        </div>
        <div className="raf-notification__extra">
          {activities.length > 1 && latestActivity.verb === 'follow' ? (
            <AvatarGroup
              onClickUser={this.props.onClickUser}
              avatarSize={30}
              users={this.getUsers(activities.slice(1, activities.length))}
            />
          ) : null}
        </div>
        {(latestActivity.verb === 'comment' ||
          latestActivity.verb === 'reaction') && (
          <Dropdown>
            <div>
              <Link
                onClick={(e) => {
                  this.suspendNotifies(e, latestActivity);
                }}
              >
                Suspend notifications
              </Link>
            </div>
          </Dropdown>
        )}
      </div>
    );
  }
}

export default withTranslationContext(Notification);
