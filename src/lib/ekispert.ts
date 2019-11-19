import qs from 'query-string';

const KEY = 'dev_ethsuMAWdSu9';

export const searchStation = (
  name: string
): Promise<Array<{ type: string; code: string; name: string }>> => {
  const queryString = qs.stringify({
    key: KEY,
    name,
  });
  const url = `https://api.ekispert.jp/v1/json/search/station/light?${queryString}`;

  return fetch(url, { referrerPolicy: 'no-referrer' })
    .then(res => res.json())
    .then(json =>
      (json.ResultSet.Point as Array<any>).map(p => ({
        type:
          typeof p.Station.Type !== 'object'
            ? p.Station.Type
            : p.Station.Type.text,
        code: p.Station.code,
        name: p.Station.Name,
      }))
    );
};

export const searchRoute = (data: {
  from: string;
  to: string;
  date: string;
  time: string;
  searchType: string;
  sort: string;
  teikiData: string;
}) => {
  const { from, to, date, time, searchType, sort , teikiData} = data;
  const queryString = qs.stringify({ 
    key: KEY,
    viaList: `${from}:${to}`,
    date: date.replace(/-/g, ''),
    time: time.replace(':', ''),
    searchType,
    sort,
    answerCount: 1,
    searchCount: 20,
    assignTeikiSerializeData: teikiData
   
  });
  
  const url = `https://api.ekispert.jp/v1/json/search/course/extreme?${queryString}`;

  return fetch(url, { referrerPolicy: 'no-referrer' }).then(res => res.json());
};

export const searchRoute2 = (data: {
  from: string;
  to: string;
  date: string;
  time: string;
  searchType: string;
  sort: string;
}) => {
  const { from, to, date, time, searchType, sort } = data;
  const queryString = qs.stringify({ 
    key: KEY,
    viaList: `${from}:${to}`,
    date: date.replace(/-/g, ''),
    time: time.replace(':', ''),
    searchType,
    sort,
    answerCount: 1,
    searchCount: 20,
   
  });
  
  const url = `https://api.ekispert.jp/v1/json/search/course/extreme?${queryString}`;

  return fetch(url, { referrerPolicy: 'no-referrer' }).then(res => res.json());
};

export const getPass = (data: {
  passFrom: string;
  passTo: string;
  searchType: string;
  sort: string;
}) => {
  const { passFrom, passTo, searchType, sort } = data;
  const queryString = qs.stringify({
    key: KEY,
    viaList: `${passFrom}:${passTo}`,
    searchType,
    sort,
    answerCount: 1,
    searchCount: 20,
  });
  const url = `https://api.ekispert.jp/v1/json/search/course/extreme?${queryString}`;

  return fetch(url, { referrerPolicy: 'no-referrer' }).then(res => res.json());
};