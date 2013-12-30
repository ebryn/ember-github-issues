import parseLinkHeader from "appkit/utils/parse-link-header";

var ROOT_URL = "https://api.github.com/",
    authToken;

export function ajax(url, options) {
  url = url.replace(ROOT_URL, ""); // just in case

  return ic.ajax(ROOT_URL + url, Ember.merge({
    headers: {
      Authorization: "token " + authToken
    }
  }, options));
}

export function rawAjax(url, options) {
  url = url.replace(ROOT_URL, ""); // just in case

  return ic.ajax.raw(ROOT_URL + url, Ember.merge({
    headers: {
      Authorization: "token " + authToken
    }
  }, options));
}

// FIXME: only gets two pages
export function getAll(url, options) {
  return rawAjax(url + "?per_page=100").then(function(result) {
    var linkHeader = result.jqXHR.getResponseHeader('Link'),
        links = parseLinkHeader(linkHeader),
        records = result.response;

    return rawAjax(links.next).then(function(result) {
      return records.concat(result.response);
    });
  });
}

export function post(url, data) {
  return ajax(url, {
    type: "POST",
    data: JSON.stringify(data),
    contentType: "application/json"
  });
}

export function patch(url, data) {
  return ajax(url, {
    type: "PATCH",
    data: JSON.stringify(data),
    contentType: "application/json"
  });
}

export function auth(token) {
  authToken = token;
}