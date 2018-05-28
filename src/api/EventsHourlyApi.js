import React from 'react';
import ReactDOM from 'react-dom';
import config from '../config';

export default class EventsHourlyApi {
    static getHourlyEvents(withRowCount, pageNumber, limit) {
        var data = {
            withRowCount: withRowCount,
            pageNumber: pageNumber,
            limit: limit
        };
        return fetch(config.apiUrl + '/events/hourly?withRowCount=' + withRowCount + '&pageNumber=' + pageNumber + '&limit=' + limit + "&timeConstraint=hourly", { method: 'GET' }, { 'mode': 'no-cors' })
            .then(response => {
                return response.json();
            }).catch(error => {
                return error;
            });
    }
}