// @flow

import React from 'react';

import UserBar from './UserBar';
import Card from './Card';
import Audio from './Audio';
import Video from './Video';
import { FileIcon } from 'react-file-utils';
import Gallery from './Gallery';
import ShowMoreText from 'react-show-more-text';

import type { ActivityData, Renderable } from '../types';
import type { Streami18Ctx } from '../Context';

import {
  smartRender,
  sanitizeURL,
  userOrDefault,
  textRenderer,
  humanizeTimestamp,
} from '../utils';
import { withTranslationContext } from '../Context';

type Props = {
  Header?: Renderable,
  Content?: Renderable,
  Footer?: Renderable,
  HeaderRight?: Renderable,
  sub?: string,
  icon?: string,
  activity: ActivityData,
  /** Handler for any routing you may do on clicks on Hashtags */
  linkHashtag?: (word: string) => mixed,
  /** Handler for any routing you may do on clicks on Mentions */
  linkMention?: (word: string) => mixed,
  /** Handler for any routing you may do on clicks on Builds */
  linkBuild?: (word: string) => mixed,
  linkUser?: (word: string) => mixed,
} & Streami18Ctx;

/**
 * Component is described here.
 *
 * @example ./examples/Activity.md
 */
class Activity extends React.Component<Props> {
  constructor() {
    super();
    this.state = { data: [] };
  }

  updateGallery = async () => {
    const galleryImages = [];

    if (
      this.props.activity.attachments &&
      this.props.activity.attachments.images &&
      Boolean(this.props.activity.attachments.images.length)
    ) {
      for (const image of this.props.activity.attachments.images) {
        await fetch(new Request(image, { method: 'HEAD', mode: 'no-cors' }))
          .then(() => {
            galleryImages.push(image);
          })
          .catch(() => {});
      }
    }

    this.setState({ data: [] });
    this.setState({ data: galleryImages });
  };

  componentDidMount() {
    this.updateGallery();
  }

  onShowMoreClick = () => {
    if (this.props.showActivity) {
      this.props.showActivity(this.props.activity);
    }
  };

  renderHeader = () => {
    const { tDateTimeParser } = this.props;
    const actor = userOrDefault(this.props.activity.actor);

    return (
      <div style={{ padding: '8px 16px' }}>
        <UserBar
          username={actor.data.name}
          avatar={actor.data.profileImage}
          linkUser={
            this.props.linkUser ? this.props.linkUser(actor.data.handle) : '#'
          }
          subtitle={
            this.props.HeaderRight != null
              ? humanizeTimestamp(this.props.activity.time, tDateTimeParser)
              : undefined
          }
          timestamp={this.props.activity.time}
          icon={this.props.icon}
          Right={this.props.HeaderRight}
        />
      </div>
    );
  };

  renderContent = () => {
    let { text } = this.props.activity;

    if (text === undefined) {
      if (typeof this.props.activity.object === 'string') {
        text = this.props.activity.object;
      } else {
        text = '';
      }
    }
    text = text.trim();
    const { attachments = {} } = this.props.activity;

    if (
      attachments &&
      attachments.og &&
      Object.keys(attachments.og).length > 0
    ) {
      attachments.og.id = this.props.activity.id;
    }

    return (
      <div className="raf-activity__content">
        {!!text && (
          <div style={{ padding: '8px 16px' }}>
            <ShowMoreText
              /* Default options */
              lines={this.props.limitLines}
              more="See more"
              less="See less"
              anchorClass="raf-activity__mention"
              onClick={this.onShowMoreClick}
              expanded={false}
              width={0}
            >
              {textRenderer(
                text,
                'raf-activity',
                this.props.linkMention,
                this.props.linkHashtag,
                this.props.linkBuild,
              )}
            </ShowMoreText>
          </div>
        )}

        {this.props.activity.verb === 'repost' &&
          this.props.activity.object instanceof Object && (
            <Card {...this.props.activity.object.data} />
          )}

        {attachments &&
          attachments.og &&
          Object.keys(attachments.og).length > 0 && (
            <div style={{ padding: '8px 16px' }}>
              {attachments.og.videos ? (
                <Video og={attachments.og} />
              ) : attachments.og.audios ? (
                <Audio og={attachments.og} />
              ) : (
                <Card {...attachments.og} />
              )}
            </div>
          )}

        {Boolean(this.props.activity.image) &&
        this.props.activity.image !== undefined ? (
          <div
            style={{
              padding: this.props.fromModal ? '8px 16px' : '8px 0',
            }}
          >
            <Gallery
              images={[this.props.activity.image]}
              // resizeMethod="resize"
            />
          </div>
        ) : null}

        {this.state.data && Boolean(this.state.data.length) && (
          <div style={{ padding: this.props.fromModal ? '8px 16px' : '8px 0' }}>
            <Gallery images={this.state.data} />
          </div>
        )}

        {attachments.files && Boolean(attachments.files.length) && (
          <ol className="raf-activity__attachments">
            {attachments.files.map(({ name, url, mimeType }, i) => (
              <a href={sanitizeURL(url)} download key={i}>
                <li className="raf-activity__file">
                  <FileIcon mimeType={mimeType} filename={name} /> {name}
                </li>
              </a>
            ))}
          </ol>
        )}
      </div>
    );
  };

  renderFooter = () => null;

  render() {
    return (
      <div className="raf-activity">
        <React.Fragment>
          {smartRender(this.props.Header, {}, this.renderHeader)}
          {smartRender(this.props.Content, {}, this.renderContent)}
          {smartRender(this.props.Footer, {}, this.renderFooter)}
        </React.Fragment>
      </div>
    );
  }
}

export default withTranslationContext(Activity);
