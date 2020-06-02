/*
 * Loading necessary data from website into global variables
 */
function loadData() {
  anime_title = document.querySelector('span[itemprop="name"]').firstChild.data;
  type = document
    .querySelector('meta[property="og:type"]')
    ["content"].replace("video.", "");

  Promise.resolve(
    browser.storage.sync.get([
      "sonarr_url",
      "sonarr_api",
      "sonarr_path",
      "sonarr_quality",
      "radarr_url",
      "radarr_api",
      "radarr_path",
      "radarr_quality",
    ])
  ).then(function (result) {
    sonarr_url = result.sonarr_url;
    sonarr_api = result.sonarr_api;
    sonarr_path = result.sonarr_path;
    sonarr_quality = result.sonarr_quality;
    radarr_url = result.radarr_url;
    radarr_api = result.radarr_api;
    radarr_path = result.radarr_path;
    radarr_quality = result.radarr_quality;
  });
  createElement();
}

function createElement() {
  var button = document.createElement("a");
  var malElement = document.getElementById("profileRows");
  var text;
  button.setAttribute("style", "font-weight:normal;");

  if (type == "tv_show") {
    text = document.createTextNode("Send to Sonarr");
    button.appendChild(text);
    malElement.appendChild(button);
    button.addEventListener(
      "click",
      function () {
        getInfoSonarr();
      },
      false
    );
  }
  if (type == "movie") {
    text = document.createTextNode("Send to Radarr");
    button.appendChild(text);
    malElement.appendChild(button);
    button.addEventListener(
      "click",
      function () {
        getInfoRadarr();
      },
      false
    );
  }
}

/*
 * Decide the type of media
 */
function decideContent() {
  if (type == "tv_show") {
    getInfoSonarr();
    return "Sonarr";
  }
  if (type == "movie") {
    getInfoRadarr();
    return "Radarr";
  }
}

/*
 * Get necessary info from sonarr via series lookup
 */
async function getInfoSonarr() {
  let url = createLookupSonarr();

  fetch(url, {
    method: "GET",
  })
    .then((data) => data.text())
    .then((json) => {
      var parse_me = JSON.parse(json)[0];
      generateRequestSonarr(
        parse_me.tvdbId,
        parse_me.title,
        parse_me.profileId,
        parse_me.titleSlug,
        parse_me.images,
        parse_me.seasons
      );
    })
    .catch(function (error) {
      console.log("request failed", error);
    });
}

/*
 * Send data to Sonarr and add series
 */
async function sendDataSonarr(params) {
  data = {};

  let url = generatedLinkSonarr;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  })
    .then((data) => data.json())
    .then((json) => {
      console.log("Sent to Sonarr!", json);
    })
    .catch(function (error) {
      console.log("request failed", error);
    });
}

/*
 * Get necessary info from radarr via movie lookup
 */
async function getInfoRadarr() {
  let url = createLookupRadarr();

  fetch(url, {
    method: "GET",
  })
    .then((data) => data.text())
    .then((json) => {
      var parse_me = JSON.parse(json)[0];
      generateRequestRadarr(
        parse_me.tmdbId,
        parse_me.title,
        parse_me.profileId,
        parse_me.titleSlug,
        parse_me.images,
        parse_me.year
      );
    })
    .catch(function (error) {
      console.log("request failed", error);
    });
}

/*
 * Send data to Radarr and add movie
 */
async function sendDataRadarr(params) {
  data = {};

  let url = generatedLinkRadarr;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  })
    .then((data) => data.json())
    .then((json) => {
      console.log("Sent to Radarr!", json);
    })
    .catch(function (error) {
      console.log("request failed", error);
    });
}

/*
 * Generate a lookup link for Sonarr
 */
function createLookupSonarr() {
  let params = {
    term: anime_title,
    apikey: sonarr_api,
  };
  let query = Object.keys(params)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&");
  return sonarr_url.concat("/api/series/lookup?") + query;
}

/*
 * Generate a request link for Sonarr to add the series
 */
function generateRequestSonarr(tv, titl, pId, slug, image, season) {
  if (sonarr_path.endsWith("/")) {
    sonarr_path = sonarr_path.concat(titl);
  } else {
    sonarr_path = sonarr_path.concat("/");
    sonarr_path = sonarr_path.concat(titl);
  }

  let params = {
    tvdbId: tv,
    title: titl,
    profileId: pId,
    titleSlug: slug,
    images: image,
    seasons: season,
    qualityProfileId: sonarr_quality,
    path: sonarr_path,
    seasonFolder: true,
    monitored: true,
    addOptions: {
      ignoreEpisodesWithFiles: false,
      ignoreEpisodesWithoutFiles: false,
      searchForMissingEpisodes: true,
    },
    apikey: sonarr_api,
  };

  let query = Object.keys(params)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&");
  generatedLinkSonarr = sonarr_url.concat("/api/series?") + query;
  sendDataSonarr(params);
}

/*
 * Generate a lookup link for Radarr
 */
function createLookupRadarr() {
  let params = {
    term: anime_title,
    apikey: radarr_api,
  };
  let query = Object.keys(params)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&");
  return radarr_url.concat("/api/movie/lookup?") + query;
}

/*
 * Generate a request link for Radarr to add the movie
 */
function generateRequestRadarr(tmdb, titl, pId, slug, image, ye) {
  if (radarr_path.endsWith("/")) {
    radarr_path = radarr_path.concat(titl);
  } else {
    radarr_path = radarr_path.concat("/");
    radarr_path = radarr_path.concat(titl);
  }

  let params = {
    tmdbId: tmdb,
    title: titl,
    profileId: pId,
    titleSlug: slug,
    images: image,
    year: ye,
    qualityProfileId: radarr_quality,
    path: radarr_path,
    monitored: true,
    addOptions: {
      searchForMovie: true,
    },
    apikey: radarr_api,
  };

  let query = Object.keys(params)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&");
  generatedLinkRadarr = radarr_url.concat("/api/movie?") + query;
  sendDataRadarr(params);
}

window.addEventListener("load", loadData);
browser.runtime.onMessage.addListener((request) => {
  var type = decideContent();
  return Promise.resolve({ response: "Sending to " + type + "..." });
});
