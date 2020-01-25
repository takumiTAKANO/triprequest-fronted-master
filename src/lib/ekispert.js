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
    }
    //   }
    // }
    );
};
exports.searchRoute = function (data) {
    var from = data.from, to = data.to, date = data.date, time = data.time, searchType = data.searchType, sort = data.sort, assignTeikiSerializeData = data.assignTeikiSerializeData;
    // if (transit === '') {
    var queryString = assignTeikiSerializeData === "null"
        ? qs.stringify({
            key: KEY,
            viaList: from + ":" + to,
            date: date.replace(/-/g, ''),
            time: time.replace(':', ''),
            searchType: searchType,
            sort: sort,
            checkEngineVersion: false,
            conditionDetail: "T3221233232319:F232112212000:A23121141:",
            answerCount: 20,
            searchCount: 20
        })
        : qs.stringify({
            key: KEY,
            viaList: from + ":" + to,
            date: date.replace(/-/g, ''),
            time: time.replace(':', ''),
            searchType: searchType,
            sort: sort,
            assignTeikiSerializeData: assignTeikiSerializeData,
            checkEngineVersion: false,
            conditionDetail: "T3221233232319:F232112212000:A23121141:",
            answerCount: 20,
            searchCount: 20
        });
    //  } else {
    // var queryString = assignTeikiSerializeData === "null"
    // ? qs.stringify({
    //   key: KEY,
    //   viaList: `${from}:${transit}:${to}`,
    //   date: date.replace(/-/g, ''),
    //   time: time.replace(':', ''),
    //   searchType,
    //   sort,
    //   checkEngineVersion: false,
    //   conditionDetail: "T3221233232319:F232112212000:A23121141:",
    //   answerCount: 20,
    //   searchCount: 20,
    // })
    // : qs.stringify({
    //   key: KEY,
    //   viaList: `${from}:${transit}:${to}`,
    //   date: date.replace(/-/g, ''),
    //   time: time.replace(':', ''),
    //   searchType,
    //   sort,
    //   assignTeikiSerializeData,
    //   checkEngineVersion: false,
    //   conditionDetail: "T3221233232319:F232112212000:A23121141:",
    //   answerCount: 20,
    //   searchCount: 20,
    // });
    //  }
    var url = "https://api.ekispert.jp/v1/json/search/course/extreme?" + queryString;
    return fetch(url, { referrerPolicy: 'no-referrer' }).then(function (res) { return res.json(); });
};
exports.getPass = function (data) {
    var from = data.from, to = data.to, sort = data.sort, transit = data.transit;
    var queryString = transit === ''
        ? qs.stringify({
            key: KEY,
            viaList: from + ":" + to,
            sort: sort,
            answerCount: 5,
            searchCount: 20,
            time: "0700"
        })
        : qs.stringify({
            key: KEY,
            viaList: from + ":" + transit + ":" + to,
            sort: sort,
            answerCount: 5,
            searchCount: 20,
            time: "0700"
        });
    var url = "https://api.ekispert.jp/v1/json/search/course/extreme?" + queryString;
    return fetch(url, { referrerPolicy: 'no-referrer' }).then(function (res) { return res.json(); });
};
