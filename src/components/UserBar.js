// @flow
import * as React from 'react';
import { humanizeTimestamp } from '../utils';
import Avatar from './Avatar';

import type { Renderable } from '../types';
import type { Streami18Ctx } from '../Context';

import { smartRender } from '../utils';
import { withTranslationContext } from '../Context';

export type Props = {|
  username: ?string,
  avatar?: string,
  subtitle?: string,
  time?: string, // text that should be displayed as the time
  timestamp?: string | number, // a timestamp that should be humanized
  icon?: string,
  linkUser?: (word: string) => mixed,
  follow?: boolean,
  Right?: Renderable,
  AfterUsername?: React.Node,
|} & Streami18Ctx;

/**
 * Component is described here.
 *
 * @example ./examples/UserBar.md
 */
class UserBar extends React.Component<Props> {
  render() {
    const { tDateTimeParser, meta } = this.props;
    let time = this.props.time;
    if (time === undefined && this.props.timestamp != null) {
      time = humanizeTimestamp(this.props.timestamp, tDateTimeParser);
    }
    return (
      <div className="raf-user-bar">
        {this.props.avatar ? (
          <Avatar
            onClick={this.props.onClickUser}
            size={50}
            circle
            image={this.props.avatar}
          />
        ) : null}
        <div className="raf-user-bar__details">
          <a
            className="raf-user-bar__username"
            href={this.props.linkUser ? this.props.linkUser : '#'}
          >
            {this.props.username}
          </a>
          {this.props.AfterUsername}
          {this.props.icon !== undefined ? (
            <img src={this.props.icon} alt="icon" loading="lazy" />
          ) : null}
          {meta && meta.garage && meta.garage.data && meta.garage.data.handle && (
            <p className="text-sm">
              {meta.build && meta.build.data && meta.build.data.handle && (
                <span>
                  <a
                    className="text-orange-400"
                    href={'/build/' + meta.build.data.handle}
                  >
                    +{meta.build.data.handle}
                  </a>
                  <span> by </span>
                </span>
              )}
              <a
                className="text-orange-400"
                href={'/garage/' + meta.garage.data.handle}
              >
                @{meta.garage.data.handle}
              </a>
            </p>
          )}
          {this.props.subtitle ? (
            <p className="raf-user-bar__subtitle">
              <time
                dateTime={this.props.timestamp}
                title={this.props.timestamp}
              >
                {this.props.subtitle}
              </time>
            </p>
          ) : null}
        </div>
        <React.Fragment>
          {smartRender(this.props.Right, {}, () => (
            <p className="raf-user-bar__extra">
              <time
                dateTime={this.props.timestamp}
                title={this.props.timestamp}
              >
                {time}
              </time>
            </p>
          ))}
        </React.Fragment>
      </div>
    );
  }
}

export default withTranslationContext(UserBar);
