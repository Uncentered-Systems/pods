// import { PROCESS_NAME } from './constants';
// import KinodeApi from '@kinode/client-api';

import * as Keychain from 'react-native-keychain';
import {CURATOR_PROCESS, PROCESS_NAME} from './constants';
import {Ack, AsyncRes, Podcasts, Result, SearchResult} from './types/types';

const ENDPOINT = `/${PROCESS_NAME}/api`;

export async function fetchState(): AsyncRes<Podcasts> {
  const params = new URLSearchParams();
  params.append('fetch-state', '1');
  // const res = await fetch(ENDPOINT + '?' + params.toString());
  const opts = {headers: {}, method: 'GET'};
  // this endpoint returns a Result too
  const res = await kinodeCall<Result<Podcasts>>(
    ENDPOINT + `?${params.toString()}`,
    opts,
  );
  const r = res as {ok: {ok: Podcasts}};
  return r.ok;
}
async function kinodeCall<T>(endpoint: string, opts: RequestInit): AsyncRes<T> {
  console.log('calling kinode', opts);
  const creds = await Keychain.getGenericPassword();
  if (!creds) return {error: 'no cookie'};
  const url = creds.username + endpoint;
  const coki = creds.password;
  const headers = {...opts.headers, Cookie: coki};
  const nopts = {...opts, headers};
  const res = await fetch(url, nopts);
  // console.log('kinode res', res);
  const j = await res.json();
  console.log('kinode j', j);
  return {ok: j};
}
export async function saveFeed(d: SearchResult): AsyncRes<Ack> {
  const body = {AddPod: d};
  const opts = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(body),
  };
  return kinodeCall(ENDPOINT, opts);
}
export async function delFeed(key: string): AsyncRes<Ack> {
  const body = {DelPod: key};
  const opts = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(body),
  };
  return kinodeCall(ENDPOINT, opts);
}

// save to curator process
//
export async function sendCurate(
  stream_name: string,
  site: string,
  post_id: string,
  postData: any,
  combined_uuid: string,
  curator_quote: string | null,
): AsyncRes<any> {
  const post = {post_id, post_json: JSON.stringify(postData)};
  const request = {
    stream_name,
    site,
    posts: [post],
    combined_uuid,
    curator_quote,
  };
  const opts = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({SetPost: request}),
  };
  return kinodeCall(`/${CURATOR_PROCESS}/set-post`, opts);
}

export async function fetchStreams() {
  const opts = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ListStreams: null}),
  };
  const res = await kinodeCall<{streams: string[]}>(
    `/${CURATOR_PROCESS}`,
    opts,
  );
  return res;
}

// fetching from podcast apps

export async function fetchPod(urls: string) {
  {
    const url = new URL(urls);
    if (url.host.endsWith('youtube.com')) return fetchYoutube(url);
  }
}
export async function fetchYoutube(_url: URL) {
  {
  }
}
