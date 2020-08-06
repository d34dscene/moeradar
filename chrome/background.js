/*
 * Open settings page
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
    chrome.tabs.query({
      currentWindow: true,
      active: true
    }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        info: "pressed shortcut"
      }, function (response) {
        decide(response.title, response.media);
      });
    });
  }
});

/*
 * Loading necessary data from settings into global variables
 */
function getSettings() {
  let moe = chrome.storage.sync.get()
    .then((result) => {
      sonarr_url = result.sonarr_url;
      sonarr_api = result.sonarr_api;
      sonarr_path = result.sonarr_path;
      sonarr_profile = result.sonarr_profile;
      radarr_url = result.radarr_url;
      radarr_api = result.radarr_api;
      radarr_path = result.radarr_path;
      radarr_profile = result.radarr_profile;
      [sonarr_url, sonarr_api, sonarr_path, sonarr_profile].every(Boolean) ? rsv_sonarr = true : rsv_sonarr = false;
      [radarr_url, radarr_api, radarr_path, radarr_profile].every(Boolean) ? rsv_radarr = true : rsv_radarr = false;
    })
    .catch((error) => {
      console.log("Something went wrong :/", error);
    });

  return moe;
}

/*
 * Decide media type
 */
async function decide(title, type) {
  console.log("Sending Request for " + title + "...");
  let series_type = ["TV", "tv_show", "TV-Series"].indexOf(type) >= 0;
  let movie_type = ["Movie", "movie"].indexOf(type) >= 0;

  await getSettings();

  if (series_type) {
    if (rsv_sonarr) {
      getInfoSonarr(title);
      chrome.notifications.create({
        type: "basic",
        iconUrl: chrome.extension.getURL("/img/send.svg"),
        title: title,
        message: "\nYour request was successfully sent to Sonarr!",
      });
    } else {
      chrome.notifications.create({
        type: "basic",
        iconUrl: chrome.extension.getURL("/img/error.svg"),
        title: "Settings missing",
        message: "\nPlease check your settings for Sonarr!",
      });
    }
  }

  if (movie_type) {
    if (rsv_radarr) {
      getInfoRadarr(title);
      chrome.notifications.create({
        type: "basic",
        iconUrl: chrome.extension.getURL("/img/send.svg"),
        title: title,
        message: "\nYour request was successfully sent to Radarr!",
      });
    } else {
      chrome.notifications.create({
        type: "basic",
        iconUrl: chrome.extension.getURL("/img/error.svg"),
        title: "Settings missing",
        message: "\nPlease check your settings for Radarr!",
      });
    }
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
function sendRequestSonarr(req_tvdbId, req_title, req_profileId, req_titleSlug, req_images, req_seasons) {
  let sonarr_path = this.sonarr_path.concat(req_title);

  let params = {
    tvdbId: req_tvdbId,
    title: req_title,
    profileId: req_profileId,
    titleSlug: req_titleSlug,
    images: req_images,
    seasons: req_seasons,
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
function sendRequestRadarr(req_tmdbId, req_title, req_profileId, req_titleSlug, req_images, req_year) {
  let radarr_path = this.radarr_path.concat(req_title);

  let params = {
    tmdbId: req_tmdbId,
    title: req_title,
    profileId: req_profileId,
    titleSlug: req_titleSlug,
    images: req_images,
    year: req_year,
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
    .catch(function (error) {
      console.log("request failed", error);
    });
}