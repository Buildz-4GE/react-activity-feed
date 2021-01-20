// @flow
import React from 'react';
import placeholder from '../images/placeholder.png';

export type Props = {|
  size?: number,
  image?: string,
  alt?: string,
  rounded?: boolean,
  circle?: boolean,
  onClick?: (e: SyntheticEvent<>) => mixed,
|};

/**
 *
 * @example ./examples/Avatar.md
 */
export default class Avatar extends React.PureComponent<Props> {
  render() {
    function getRandomString(length) {
      const randomChars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += randomChars.charAt(
          Math.floor(Math.random() * randomChars.length),
        );
      }
      return result;
    }

    const { size, image, alt, rounded, circle } = this.props;

    const avatarFallbackImageId = 'avatarFallback-' + getRandomString(40);
    const avatarImageId = 'avatarImage-' + getRandomString(40);

    return (
      <React.Fragment>
        <svg
          id={avatarFallbackImageId}
          style={
            size
              ? { width: `${size}px`, height: `${size}px`, display: 'none' }
              : { display: 'none' }
          }
          className={`text-gray-300 bg-gray-200 raf-avatar ${
            rounded ? 'raf-avatar--rounded' : ''
          } ${circle ? 'raf-avatar--circle' : ''}`}
          fill="currentColor"
          viewBox="0 0 24 24"
          onClick={this.props.onClick}
        >
          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <img
          id={avatarImageId}
          onError={() => {
            document.getElementById(avatarImageId).style.display = 'none';
            document.getElementById(avatarFallbackImageId).style.display =
              'block';
          }}
          style={size ? { width: `${size}px`, height: `${size}px` } : {}}
          className={`raf-avatar ${rounded ? 'raf-avatar--rounded' : ''} ${
            circle ? 'raf-avatar--circle' : ''
          }`}
          onClick={this.props.onClick}
          src={image ? image : placeholder}
          alt={alt || ''}
          loading="lazy"
        />
      </React.Fragment>
    );
  }
}
