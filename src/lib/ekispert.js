"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const query_string_1 = __importDefault(require("query-string"));
const KEY = 'dev_ethsuMAWdSu9';
exports.searchStation = (name) => {
    const queryString = query_string_1.default.stringify({
        key: KEY,
        name,
    });
    const url = `https://api.ekispert.jp/v1/json/search/station/light?${queryString}`;
    return fetch(url, { referrerPolicy: 'no-referrer' })
        .then(res => res.json())
        .then(json => json.ResultSet.Point.map(p => ({
        type: typeof p.Station.Type !== 'object'
            ? p.Station.Type
            : p.Station.Type.text,
        code: p.Station.code,
        name: p.Station.Name,
    })));
};
exports.searchRoute = (data) => {
    const { from, to, date, time, searchType, sort, teikiData } = data;
    const queryString = query_string_1.default.stringify({
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
exports.searchRoute2 = (data) => {
    const { from, to, date, time, searchType, sort } = data;
    const queryString = query_string_1.default.stringify({
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
exports.getPass = (data) => {
    const { passFrom, passTo, searchType, sort } = data;
    const queryString = query_string_1.default.stringify({
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
