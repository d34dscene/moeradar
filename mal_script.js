var sonarr_url;
var sonarr_api;
var sonarr_path;
var sonarr_quality;
var radarr_url;
var radarr_api;
var radarr_path;
var radarr_quality;
var anime_title = document.querySelector('span[itemprop="name"]').firstChild
  .data;
var type = document
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

async function getInfoSonarr() {
  let params = {
    term: anime_title,
    apikey: sonarr_api,
  };
  let query = Object.keys(params)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&");
  let url = addLookupSonarr() + query;

  fetch(url, {
    method: "GET",
  })
    .then((data) => data.text())
    .then((json) => {
      var parse_me = JSON.parse(json)[0];
      parseDataSonarr(
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

async function parseDataSonarr(tv, titl, pId, slug, image, season) {
  data = {};

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
  let url = addPostSonarr() + query;

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

async function getInfoRadarr() {
  let params = {
    term: anime_title,
    apikey: radarr_api,
  };
  let query = Object.keys(params)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&");
  let url = addLookupRadarr() + query;

  fetch(url, {
    method: "GET",
  })
    .then((data) => data.text())
    .then((json) => {
      var parse_me = JSON.parse(json)[0];
      parseDataRadarr(
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
async function parseDataRadarr(tmdb, titl, pId, slug, image, ye) {
  data = {};

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
  let url = addPostRadarr() + query;

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
function addLookupSonarr() {
  return sonarr_url.concat("/api/series/lookup?");
}

function addPostSonarr() {
  return sonarr_url.concat("/api/series?");
}

function addLookupRadarr() {
  return radarr_url.concat("/api/movie/lookup?");
}

function addPostRadarr() {
  return radarr_url.concat("/api/movie?");
}

window.onload = createElement;
