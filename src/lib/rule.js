"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const KIE_SERVER_URL = 'http://localhost:8888';
function checkAccommodation(data) {
    if (data.stayClass === '日帰り' || data.stayClass === '宿泊(帰着日)') {
        return Promise.resolve(Object.assign(Object.assign({}, data), { accommodationAmount: 0, accommodationDescription: '宿泊がないため宿泊料は支給されません' }));
    }
    return fetch(`${KIE_SERVER_URL}/accommodations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(data),
    })
        .then(res => res.json())
        .then((json) => json);
}
exports.checkAccommodation = checkAccommodation;
function checkDailyAllowance(data) {
    return fetch(`${KIE_SERVER_URL}/dailyallowances`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(data),
    })
        .then(res => res.json())
        .then((json) => json);
}
exports.checkDailyAllowance = checkDailyAllowance;
