"use strict";
exports.__esModule = true;
var qs = require("query-string");
var KEY = 'dev_ethsuMAWdSu9';
exports.searchStation = function (name) {
    var queryString = qs.stringify({
        key: KEY,
        name: name
    });
    var url = "https://api.ekispert.jp/v1/json/search/station/light?" + queryString;
    return fetch(url, { referrerPolicy: 'no-referrer' })
        .then(function (res) { return res.json(); })
        .then(function (json) {
        return json.ResultSet.Point.map(function (p) { return ({
            type: typeof p.Station.Type !== 'object'
                ? p.Station.Type
                : p.Station.Type.text,
            code: p.Station.code,
            name: p.Station.Name
        }); });
    });
};
exports.searchRoute = function (data) {
    var from = data.from, to = data.to, date = data.date, time = data.time, searchType = data.searchType, sort = data.sort, assignTeikiSerializeData = data.assignTeikiSerializeData;
    var queryString = qs.stringify({
        key: KEY,
        viaList: from + ":" + to,
        date: date.replace(/-/g, ''),
        time: time.replace(':', ''),
        searchType: searchType,
        sort: sort,
        assignTeikiSerializeData: assignTeikiSerializeData,
        conditionDetail: "T3221233232319:F232112212000:A23121141:",
        answerCount: 10,
        searchCount: 20
    });
    var url = "https://api.ekispert.jp/v1/json/search/course/extreme?" + queryString;
    return fetch(url, { referrerPolicy: 'no-referrer' }).then(function (res) { return res.json(); });
};
exports.getPass = function (data) {
    var from = data.from, to = data.to, searchType = data.searchType, sort = data.sort;
    var queryString = qs.stringify({
        key: KEY,
        viaList: from + ":" + to,
        searchType: searchType,
        sort: sort,
        answerCount: 5,
        searchCount: 20
    });
    var url = "https://api.ekispert.jp/v1/json/search/course/extreme?" + queryString;
    return fetch(url, { referrerPolicy: 'no-referrer' }).then(function (res) { return res.json(); });
};
