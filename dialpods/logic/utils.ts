import {
  LongTime,
  Result,
  RSSFeed,
  SearchResult,
  YoutubeChannel,
} from './types/types';
// import DOMparser from 'react-native-html-parser';
import DOMParser from 'advanced-html-parser';
import {Document, Element} from 'advanced-html-parser/types';

export async function parseHTMLRes(htmls: string) {
  // const parser = new DOMparser.DOMParser();
  // const html = parser.parseFromString(htmls, 'text/html');
  const html = DOMParser.parse(htmls);
  return html;
}
export function parseYoutubeChannel(head: Element): Result<SearchResult> {
  const linkEl = head.querySelector('link[type="application/rss+xml"]');
  console.log('linkEl', linkEl);
  if (!linkEl) return {error: `not found`};
  const url = linkEl!.getAttribute('href');
  console.log('url', url);
  if (!url) return {error: `not found`};
  const og = head.querySelectorAll('meta');
  let image = '';
  let name = '';
  for (const meta of og) {
    if (image && name) break;
    const n = meta.getAttribute('property');
    if (n === 'og:image') image = meta.getAttribute('content')!;
    if (n === 'og:title') name = meta.getAttribute('content')!;
  }
  console.log(image, name);
  if (image && name && url) return {ok: {image, name, url}};
  else return {error: 'not found'};
}
export async function parseXMLRes(s: string) {
  const xml = DOMParser.parse(s);
  // const parser = new DOMparser.DOMParser();
  // const xml = parser.parseFromString(s, 'text/xml');
  return xml;
}

export function parseRSSFeed(
  url: string,
  docc: Document,
): Result<SearchResult> {
  const doc = docc.documentElement;
  const chan = doc.getElementsByTagName('channel')[0];
  const title = chan.getElementsByTagName('title')[0];
  const image = chan.getElementsByTagName('image')[0];
  const imageURL = image.getElementsByTagName('url')[0];
  try {
    return {
      ok: {
        name: title.textContent!,
        image: imageURL.textContent!,
        url,
      },
    };
  } catch (_) {
    return {error: 'not found'};
  }
}
const namespaces: any = {
  itunes: 'http://www.itunes.com/dtds/podcast-1.0.dtd',
  podcast: 'https://podcastindex.org/namespace/1.0',
  content: 'http://purl.org/rss/1.0/modules/content/',
  dc: 'http://purl.org/dc/elements/1.1/',
  atom: 'http://www.w3.org/2005/Atom',
  podaccess: 'https://access.acast.com/schema/1.0',
  media: 'http://search.yahoo.com/mrss/',
};
export function parseRSSFull(url: string, docc: Document): Result<RSSFeed> {
  const doc = docc.documentElement;
  try {
    // Helper function to get namespaced elements
    const getNS = (element: Element, namespace: string, tagName: string) =>
      element.getElementsByTagNameNS(namespaces[namespace], tagName)[0];

    // Parse channel (podcast) information
    const channel = doc.getElementsByTagName('channel')[0];
    const podcastInfo = {
      title: channel.getElementsByTagName('title')[0].textContent || '',
      description:
        channel.getElementsByTagName('description')[0].textContent || '',
      link: channel.getElementsByTagName('link')[0].textContent || '',
      copyright: channel.getElementsByTagName('copyright')[0].textContent || '',
      language: channel.getElementsByTagName('language')[0].textContent || '',
      //
      //
      //
      // lastBuildDate:
      //     channel.getElementsByTagName('lastBuildDate')[0],
      // ),

      // iTunes specific fields
      author: getNS(channel, 'itunes', 'author').textContent || '',
      type: getNS(channel, 'itunes', 'type').textContent || '',
      // owner: {
      //     name:
      //         getNS(channel, 'itunes', 'owner')?.getElementsByTagNameNS(
      //             namespaces.itunes,
      //             'name',
      //         )[0],
      //     ),
      //     email:
      //         getNS(channel, 'itunes', 'owner')?.getElementsByTagNameNS(
      //             namespaces.itunes,
      //             'email',
      //         )[0],
      //     ),
      // },
      image:
        channel.getElementsByTagName('image')[0]?.getElementsByTagName('url')[0]
          ?.textContent || '',

      // image: {
      //     url: channel
      //         .getElementsByTagName('image')[0]
      //         ?.getElementsByTagName('url')[0]?.textContent,
      //     itunesUrl: getNS(channel, 'itunes', 'image')?.getAttribute('href'),
      // },

      // Categories
      categories: Array.from(
        channel.getElementsByTagNameNS(namespaces.itunes, 'category'),
      ).map(category => ({
        text: category.getAttribute('text') || '',
        subcategories: Array.from(
          category.getElementsByTagNameNS(namespaces.itunes, 'category'),
        ).map(sub => sub.getAttribute('text') || ''),
      })),

      // Podcast namespace specific fields
      // podcastGuid: getNS(channel, 'podcast', 'guid')),
      // hosts: Array.from(
      //     channel.getElementsByTagNameNS(namespaces.podcast, 'person'),
      // )
      //     .filter((person) => person.getAttribute('role') === 'Host')
      //     .map((person) => ({
      //         name: person.textContent,
      //         role: person.getAttribute('role'),
      //         img: person.getAttribute('img'),
      //         href: person.getAttribute('href'),
      //     })),
    };

    // Parse episodes
    const episodes = Array.from(doc.getElementsByTagName('item')).map(item => {
      // console.log(item, 'rss episode');
      // Get episode images
      const itunesImage = getNS(item, 'itunes', 'image');
      const desc: Element = item.getElementsByTagName('description')[0];
      console.log('ep desc', desc.innerHTML);
      let description = desc.textContent;

      // TODO some cdata fuckery here
      if (desc.innerHTML.includes('CDATA')) {
        const cdata = desc.innerHTML.replace(/<!\[CDATA\[(.*?)\]\]>/s, '$1');
        const cdataparse = DOMParser.parse(cdata);
        description = cdataparse.documentElement.firstChild?.textContent || '';
      }
      // .replace(/<[^>]*>/g, ' ')
      // // Remove extra spaces
      // .replace(/\s+/g, ' ')
      // .trim();

      return {
        title: item.getElementsByTagName('title')[0].textContent || '',
        link: item.getElementsByTagName('link')[0].textContent || '',
        guid: {
          value: item.getElementsByTagName('guid')[0].textContent || '',
          isPermaLink:
            item
              .getElementsByTagName('guid')[0]
              ?.getAttribute('isPermaLink') === 'true',
        },
        pubDate: item.getElementsByTagName('pubDate')[0].textContent || '',

        // author: item.getElementsByTagName('author')[0],

        // Episode content
        // description:
        //   item.getElementsByTagName('description')[0].textContent || '',
        description,

        // content:
        //     getNS(item, 'content', 'encoded'),
        // )?.trim(),

        // Media information
        enclosure: {
          url: item.getElementsByTagName('enclosure')[0]?.getAttribute('url')!,
          length: parseInt(
            item.getElementsByTagName('enclosure')[0]?.getAttribute('length')!,
          ),
          type: item
            .getElementsByTagName('enclosure')[0]
            ?.getAttribute('type')!,
        },

        // iTunes specific episode fields
        // itunesInfo: {
        //     episode: getNS(item, 'itunes', 'episode')),
        //     season: getNS(item, 'itunes', 'season')),
        //     duration: getNS(item, 'itunes', 'duration')),
        //     explicit: getNS(item, 'itunes', 'explicit')),
        //     episodeType:
        //         getNS(item, 'itunes', 'episodeType'),
        //     ),
        //     image: itunesImage
        //         ? itunesImage.getAttribute('href')
        //         : null,
        // },

        // Podcast namespace fields
        // podcastInfo: {
        //     season: getNS(item, 'podcast', 'season')),
        //     episode: getNS(item, 'podcast', 'episode')),
        //     hosts: Array.from(
        //         item.getElementsByTagNameNS(
        //             namespaces.podcast,
        //             'person',
        //         ),
        //     )
        //         .filter(
        //             (person) => person.getAttribute('role') === 'Host',
        //         )
        //         .map((person) => ({
        //             name: person.textContent,
        //             role: person.getAttribute('role'),
        //             img: person.getAttribute('img'),
        //             href: person.getAttribute('href'),
        //         })),
        // },
      };
    });

    return {
      ok: {
        podcast: podcastInfo,
        episodes,
      },
    };
  } catch (e) {
    return {error: 'error parsing feed'};
  }
}

export function parseYTFeed(doc: Document): Result<YoutubeChannel> {
  // Create parser and parse XML string
  // Define namespaces used in the document
  const namespaces = {
    media: 'http://search.yahoo.com/mrss/',
    yt: 'http://www.youtube.com/xml/schemas/2015',
    atom: 'http://www.w3.org/2005/Atom',
  };

  // Helper function to safely get text content
  const getTextContent = (element: Element) => element.textContent!;

  // Parse each entry
  const entries = Array.from(doc.getElementsByTagName('entry')).map(entry => {
    // Get media:group element
    const mediaGroup = entry.getElementsByTagNameNS(
      namespaces.media,
      'group',
    )[0];

    // Get statistics and rating from media:community
    const mediaCommunity = mediaGroup.getElementsByTagNameNS(
      namespaces.media,
      'community',
    )[0];
    const statistics = mediaCommunity.getElementsByTagNameNS(
      namespaces.media,
      'statistics',
    )[0];
    const starRating = mediaCommunity.getElementsByTagNameNS(
      namespaces.media,
      'starRating',
    )[0];

    return {
      id: getTextContent(entry.getElementsByTagName('id')[0]),
      videoId: getTextContent(
        entry.getElementsByTagNameNS(namespaces.yt, 'videoId')[0],
      ),
      title: getTextContent(entry.getElementsByTagName('title')[0]),
      published: getTextContent(entry.getElementsByTagName('published')[0]),
      updated: getTextContent(entry.getElementsByTagName('updated')[0]),
      link: entry.getElementsByTagName('link')[0]?.getAttribute('href')!,

      // Media group information
      thumbnail: mediaGroup
        .getElementsByTagNameNS(namespaces.media, 'thumbnail')[0]
        ?.getAttribute('url')!,
      description: getTextContent(
        mediaGroup.getElementsByTagNameNS(namespaces.media, 'description')[0],
      ),

      // Statistics
      views: parseInt(statistics?.getAttribute('views') || '0'),
      rating: {
        count: parseInt(starRating?.getAttribute('count') || '0'),
        average: parseFloat(starRating?.getAttribute('average') || '0'),
      },
    };
  });

  // Get channel information
  const channelInfo = {
    title: getTextContent(doc.getElementsByTagName('title')[0]),
    channelId: getTextContent(
      doc.getElementsByTagNameNS(namespaces.yt, 'channelId')[0],
    ),
    published: getTextContent(doc.getElementsByTagName('published')[0]),
    author: getTextContent(doc.getElementsByTagName('name')[0]),
    authorUrl: getTextContent(doc.getElementsByTagName('uri')[0]),
  };

  return {
    ok: {
      channel: channelInfo,
      entries: entries,
    },
  };
}

export function abbreviate(s: string, length: number): string {
  if (s.length <= length) return s;
  else return s.substring(0, length) + '...';
}

export function date_diff(date: Date) {
  const now = new Date().getTime();
  const s = now - date.getTime();
  if (s < 60) {
    return 'now';
  } else if (s < 3600) {
    return `${Math.ceil(s / 60)}minutes ago`;
  } else if (s < 86400) {
    return `${Math.ceil(s / 60 / 60)}hours ago`;
  } else if (s < 32140800) {
    return date.toLocaleString('default', {
      month: 'long',
      day: 'numeric',
    });
  } else {
    return date.toLocaleString('default', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
export function durationString(secs: number): string {
  const hours = Math.floor(secs / 3600);
  const minutes = Math.floor((secs % 3600) / 60);
  const seconds = Math.floor(secs % 60);
  return hours > 0
    ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`
    : `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function parseSeconds(secs: number): LongTime {
  const hours = Math.floor(secs / 3600);
  const minutes = Math.floor((secs % 3600) / 60);
  const seconds = Math.floor((secs % 3600) % 60);
  return {hours, minutes, seconds, ms: 0};
}
export function padTimeString(num: number): string {
  if (num.toString().length < 2) return `0${num}`;
  else return num.toString();
}
export function printLongTime(l: LongTime): string {
  const mins = padTimeString(l.minutes);
  const secs = padTimeString(l.seconds);
  const base = `${mins}:${secs}`;
  if (l.hours === 0) return base;
  else return `${l.hours}:${base}`;
}
