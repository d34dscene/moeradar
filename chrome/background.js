/* Waiting for user input */

function onError(error) {
  console.log(`Error: ${error}`);
}

/*
 * Get to settings page
 */
chrome.browserAction.onClicked.addListener(function () {
  chrome.tabs.create({
    url: "settings.html",
  });
});

/*
 * Keyboard shortcut on current tab
 */
chrome.commands.onCommand.addListener(function (command) {
  if (command == "send-key") {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { info: "pressed shortcut" }, function (response) {
        decide(response.title, response.media);
      });
    });
  }
});

/* Sending data pipeline */

/*
 * Loading necessary data from settings into global variables
 */

chrome.storage.sync.get(
  [
    "sonarr_url",
    "sonarr_api",
    "sonarr_path",
    "sonarr_profile",
    "radarr_url",
    "radarr_api",
    "radarr_path",
    "radarr_profile",
  ],
  function (result) {
    sonarr_url = result.sonarr_url;
    sonarr_api = result.sonarr_api;
    sonarr_path = result.sonarr_path;
    sonarr_profile = result.sonarr_profile;
    radarr_url = result.radarr_url;
    radarr_api = result.radarr_api;
    radarr_path = result.radarr_path;
    radarr_profile = result.radarr_profile;
    if ([sonarr_url, sonarr_api, sonarr_path, sonarr_profile].every(Boolean)) {
      isResolvedS = true;
    } else {
      isResolvedS = false;
    }
    if ([radarr_url, radarr_api, radarr_path, radarr_profile].every(Boolean)) {
      isResolvedR = true;
    } else {
      isResolvedR = false;
    }
  }
);

/*
 * Decide media type
 */
function decide(title, type) {
  if (["TV", "tv_show", "TV-Series"].indexOf(type) >= 0) {
    if (isResolvedS) {
      //getInfoSonarr(title);
      chrome.notifications.create({
          type: "basic",
          iconUrl: chrome.extension.getURL("img/send.svg"),
          title: title,
          message: "\nYour request was successfully sent to Sonarr!",
        });
    } else {
      chrome.notifications.create({
        type: "basic",
        iconUrl: chrome.extension.getURL("img/clear.svg"),
        title: "Settings missing",
        message: "\nPlease check your settings for Sonarr!",
      });
    }
  } else if (["Movie", "movie"].indexOf(type) >= 0) {
    if (isResolvedR) {
      getInfoRadarr(title);
      chrome.notifications.create({
        type: "basic",
        iconUrl: chrome.extension.getURL("img/send.svg"),
        title: title,
        message: "\nYour request was successfully sent to Radarr!",
      });
    } else {
      chrome.notifications.create({
        type: "basic",
        iconUrl: chrome.extension.getURL("img/clear.svg"),
        title: "Settings missing",
        message: "\nPlease check your settings for Radarr!",
      });
    }
  } else {
    chrome.notifications.create({
      type: "basic",
      iconUrl: chrome.extension.getURL("img/error.svg"),
      title: "Wrong media type",
      message: "\nThat's neither a series nor a movie... B-baka!",
    });
  }
}

/*
 * Get necessary info from sonarr via series lookup
 */
async function getInfoSonarr(title) {
  let params = {
    term: title,
    apikey: sonarr_api,
  };
  let query = Object.keys(params)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&");

  let url = sonarr_url.concat("/api/series/lookup?") + query;

  fetch(url, {
    method: "GET",
  })
    .then((data) => data.text())
    .then((json) => {
      var parse_me = JSON.parse(json)[0];
      sendRequestSonarr(
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
 * Send a request to Sonarr and add the series
 */
function sendRequestSonarr(tv, titl, pId, slug, image, season) {
  sonarr_path = sonarr_path.concat(titl);

  let params = {
    tvdbId: tv,
    title: titl,
    profileId: pId,
    titleSlug: slug,
    images: image,
    seasons: season,
    qualityProfileId: sonarr_profile,
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
  let url = sonarr_url.concat("/api/series?") + query;

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
async function getInfoRadarr(title) {
  let params = {
    term: title,
    apikey: radarr_api,
  };
  let query = Object.keys(params)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&");
  let url = radarr_url.concat("/api/movie/lookup?") + query;

  fetch(url, {
    method: "GET",
  })
    .then((data) => data.text())
    .then((json) => {
      var parse_me = JSON.parse(json)[0];
      sendRequestRadarr(
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
 * Send a request to Radarr and add the movie
 */
function sendRequestRadarr(tmdb, titl, pId, slug, image, ye) {
  radarr_path = radarr_path.concat(titl);

  let params = {
    tmdbId: tmdb,
    title: titl,
    profileId: pId,
    titleSlug: slug,
    images: image,
    year: ye,
    qualityProfileId: radarr_profile,
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
  let url = radarr_url.concat("/api/movie?") + query;

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
