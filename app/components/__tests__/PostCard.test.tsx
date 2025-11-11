jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    width,
    height,
    ...props
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
    [key: string]: any;
  }) => <img src={src} alt={alt} width={width} height={height} {...props} />,
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RenderPostCard from '@/app/[locale]/dashboard/posts/Postcard';
import { DictType } from '@/app/lib/type/dictType';
import { POSTCARD_CONTENT } from '@/app/lib/constants';

describe('PostCard Component', () => {
  const mockDict: DictType = {
    dashboard: {
      posts: {
        noTitle: 'No Title',
        noContent: 'No Content',
        readMore: 'Read More →',
      },
    },
  };

  const defaultProps = {
    id: 'post-1',
    title: 'Test Post Title',
    body: 'This is a test post body',
    userId: 'user-1',
    locale: 'en',
    dict: mockDict,
    image: '/images/test.jpg',
  };

  test('renders PostCard component title and content', () => {
    render(<RenderPostCard {...defaultProps} />);

    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
  });

  test('renders PostCard component with body content', () => {
    render(<RenderPostCard {...defaultProps} />);

    expect(screen.getByText('This is a test post body')).toBeInTheDocument();
  });

  test('renders correct link href with locale and postId', () => {
    render(<RenderPostCard {...defaultProps} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/en/dashboard/posts/post-1');
  });

  test('renders "Read More" text from dictionary', () => {
    render(<RenderPostCard {...defaultProps} />);

    expect(screen.getByText('Read More →')).toBeInTheDocument();
  });

  test('displays default title when title is empty', () => {
    const emptyTitleProps = {
      ...defaultProps,
      title: '',
    };

    render(<RenderPostCard {...emptyTitleProps} />);

    expect(
      screen.getByText(
        mockDict?.dashboard?.posts?.noTitle || POSTCARD_CONTENT.NO_TITLE
      )
    ).toBeInTheDocument();
  });

  test('displays default content when body is empty', () => {
    const emptyBodyProps = {
      ...defaultProps,
      body: '',
    };

    render(<RenderPostCard {...emptyBodyProps} />);

    expect(
      screen.getByText(
        mockDict?.dashboard?.posts?.noContent || POSTCARD_CONTENT.NO_CONTENT
      )
    ).toBeInTheDocument();
  });

  test('renders image with correct src attribute', () => {
    render(<RenderPostCard {...defaultProps} />);

    const image = screen.getByAltText('Test Post Title');
    expect(image).toHaveAttribute('src', '/images/test.jpg');
  });

  test('renders default image when image prop is not provided', () => {
    const noImageProps = {
      ...defaultProps,
      image: undefined,
    };

    render(<RenderPostCard {...noImageProps} />);

    const image = screen.getByAltText('Test Post Title');
    expect(image).toHaveAttribute('src', '/images/default_image.png');
  });

  test('renders with different locales', () => {
    const vietnameseProps = {
      ...defaultProps,
      locale: 'vi',
    };

    render(<RenderPostCard {...vietnameseProps} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/vi/dashboard/posts/post-1');
  });

  test('truncates long titles correctly', () => {
    const longTitleProps = {
      ...defaultProps,
      title:
        'This is a very long title that should be truncated to two lines and show ellipsis if it exceeds that length',
    };

    render(<RenderPostCard {...longTitleProps} />);

    const titleElement = screen.getByText(/This is a very long title/);
    expect(titleElement).toHaveClass('line-clamp-2');
  });

  test('truncates long body text correctly', () => {
    const longBodyProps = {
      ...defaultProps,
      body: 'This is a very long body content that should be truncated to two lines and show ellipsis if it exceeds that length in the preview',
    };

    render(<RenderPostCard {...longBodyProps} />);

    const bodyElement = screen.getByText(/This is a very long body content/);
    expect(bodyElement).toHaveClass('line-clamp-2');
  });

  test('renders PostCard with whitespace-only title as empty', () => {
    const whitespaceProps = {
      ...defaultProps,
      title: '   ',
    };

    render(<RenderPostCard {...whitespaceProps} />);

    expect(
      screen.getByText(
        mockDict?.dashboard?.posts?.noTitle || POSTCARD_CONTENT.NO_TITLE
      )
    ).toBeInTheDocument();
  });

  test('renders PostCard as clickable link', () => {
    render(<RenderPostCard {...defaultProps} />);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
  });

  test('renders PostCard link with correct HTML tag', () => {
    render(<RenderPostCard {...defaultProps} />);

    const link = screen.getByRole('link');
    expect(link.tagName).toBe('A');
  });

  test('renders component with Vietnamese locale', () => {
    const viDict: DictType = {
      dashboard: {
        posts: {
          noTitle: 'Không có tiêu đề',
          noContent: 'Không có nội dung',
          readMore: 'Đọc thêm →',
        },
      },
    };

    const viProps = {
      ...defaultProps,
      locale: 'vi',
      dict: viDict,
    };

    render(<RenderPostCard {...viProps} />);

    expect(screen.getByText('Đọc thêm →')).toBeInTheDocument();
  });
});
