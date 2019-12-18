import *as qs from 'query-string';

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
  assignTeikiSerializeData:string;
}) => {
  const { from, to, date, time, searchType, sort, assignTeikiSerializeData} = data;
  const queryString = qs.stringify({ 
    key: KEY,
    viaList: `${from}:${to}`,
    date: date.replace(/-/g, ''),
    time: time.replace(':', ''),
    searchType,
    sort,
    assignTeikiSerializeData,
    conditionDetail: "T3221233232319:F232112212000:A23121141:",
    answerCount: 10,
    searchCount: 20,
   
  });
  
  const url = `https://api.ekispert.jp/v1/json/search/course/extreme?${queryString}`;

  return fetch(url, { referrerPolicy: 'no-referrer' }).then(res => res.json());
};

export const getPass = (data: {
  from: string;
  to: string;
  searchType: string;
  sort: string;
}) => {
  const { from, to, searchType, sort } = data;
  const queryString = qs.stringify({
    key: KEY,
    viaList: `${from}:${to}`,
    searchType,
    sort,
    answerCount: 5,
    searchCount: 20,
  });
  const url = `https://api.ekispert.jp/v1/json/search/course/extreme?${queryString}`;

  return fetch(url, { referrerPolicy: 'no-referrer' }).then(res => res.json());
};