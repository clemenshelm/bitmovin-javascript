import urljoin from 'url-join';
import http, {utils} from '../http';
import BitmovinError from '../BitmovinError';
import {isValidApiRequestDateString} from '../DateUtils';

export const statistics = (configuration, http) => {
  const {get} = http;

  const addOptionsToUrl = (url, options) => {
    let newUrl = url;
    let {limit, offset} = options;

    if (options !== {} && options.from && options.to) {
      if (!isValidApiRequestDateString(options.from) || !isValidApiRequestDateString(options.to)) {
        console.error('Wrong date format! Correct format is yyyy-MM-dd');
        return Promise.reject(new BitmovinError('Wrong date format! Correct format is yyyy-MM-dd', {}));
      }
      newUrl = urljoin(newUrl, options.from, options.to);
    }

    const getParams = utils.buildGetParamString({
      limit: limit,
      offset: offset
    });

    if (getParams.length > 0) {
      newUrl = urljoin(newUrl, getParams);
    }

    return newUrl;
  };

  const daily = (options = {}) => {
    let url = urljoin(configuration.apiBaseUrl, 'encoding/statistics/daily');
    url = addOptionsToUrl(url, options);
    return get(configuration, url);
  };

  const typeFn = (type) => {
    return {
      daily: (options = {}) => {
        let url = urljoin(configuration.apiBaseUrl, 'encoding/statistics/encodings/', type, '/daily');
        url = addOptionsToUrl(url, options);
        return get(configuration, url);
      },

      list: (options = {}) => {
        let url = urljoin(configuration.apiBaseUrl, 'encoding/statistics/encodings/', type);
        url = addOptionsToUrl(url, options);
        return get(configuration, url);
      }
    };
  };

  return {

    /*
     * Gets the overall encoding statistics
     *
     * Options is a hash with optional parameters:
     * limit: Number - maximum results
     * offset: Number - skip n results
     *
     * If from and to is set only statistics between these two dates are returned
     * from: Date
     * to: Date
    */
    overall: (from = null, to = null) => {
      let url = urljoin(configuration.apiBaseUrl, 'encoding/statistics');
      if (from && to) {
        url = urljoin(url, from, to);
      }
      return get(configuration, url);
    },

    vod: typeFn('vod'),
    live: typeFn('live'),
    daily,

    encodings: (encodingId) => {
      return {
        statistics: () => {
          const url = urljoin(configuration.apiBaseUrl, 'encoding/statistics/encodings', encodingId);
          return get(configuration, url);
        },
        liveStatistics: () => {
          const url = urljoin(configuration.apiBaseUrl, 'encoding/statistics/encodings', encodingId, 'live-statistics');
          return get(configuration, url);
        }
      };
    }
  };
};

export default (configuration) => {
  return statistics(configuration, http);
};
