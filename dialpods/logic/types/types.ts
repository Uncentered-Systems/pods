export type AsyncRes<T> = Promise<Result<T>>;
export type Result<T> = {ok: T} | {error: string};

export type Podcasts = Record<string, Podcast>;
export type Ack = null;
export type Podcast = SearchResult;

export type SearchResult = {
  image: string;
  name: string;
  url: string;
  description?: string;
};

export type YoutubeChannel = {
  channel: {
    author: string;
    authorUrl: string;
    channelId: string;
    published: string;
    title: string;
    description: string;
    image: string;
  };
  entries: YoutubeItem[];
};
export type YoutubeItem = {
  id: string;
  videoId: string;
  title: string;
  published: string;
  updated: string;
  link: string;
  thumbnail: string;
  description: string;
  views: number;
  rating: {
    count: number;
    average: number;
  };
};
export type RSSFeed = {
  podcast: {
    title: string;
    description: string;
    link: string;
    copyright: string;
    language: string;
    lastBuildDate?: string;
    author: string;
    type: string;
    image: string;
    // categories: Array<{ text: string; subcategories: string[] }>;
    // podcastGuid: string;
  };
  episodes: RSSFeedItem[];
};
// TODO deal with CData encoding
export type RSSFeedItem = {
  title: string;
  link: string;
  guid: {value: string; isPermaLink: boolean};
  pubDate: string;
  // author: string;
  description: string;
  // content: string;
  enclosure: {url: string; length: number; type: string};
  // podcastInfo: { season: string; episode: string };
};

export type LongTime = {
  hours: number;
  minutes: number;
  seconds: number;
  ms: number;
};

export type Progress = {
  guid: string;
  link: string;
  title: string;
  published: number;
  duration: number;
  progress: 'Done' | 'NotStarted' | {Started: number};
};
