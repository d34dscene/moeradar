var sonarr_api = document.querySelector("#sonarr_api");
var radarr_api = document.querySelector("#radarr_api");
var sonarr_url = document.querySelector("#sonarr_url");
var radarr_url = document.querySelector("#radarr_url");
var sonarr_path = document.querySelector("#sonarr_path");
var radarr_path = document.querySelector("#radarr_path");
var sonarr_profile_id = document.querySelector("#sonarr_quality");
var radarr_profile_id = document.querySelector("#radarr_quality");

let correctPath = path => !path.endsWith("/") ? path.concat("/") : !path.startsWith("/") ? "/" + path : path;
let correctUrl = url => !url.startsWith("http://") && !url.startsWith("https://") ? "http://" + url : url;

function saveOptions() {
  browser.storage.sync.set({
    sonarr_api: sonarr_api.value,
    sonarr_url: sonarr_url.value !== "" ? correctUrl(sonarr_url.value) : sonarr_url.value,
    sonarr_path: sonarr_path.value !== "" ? correctPath(sonarr_path.value) : sonarr_path.value,
    sonarr_profile: sonarr_profile_id.value,
    sonarr_quality: sonarr_profile_id.options[sonarr_profile_id.value].text,

    radarr_api: radarr_api.value,
    radarr_url: radarr_url.value !== "" ? correctUrl(radarr_url.value) : radarr_url.value,
    radarr_path: radarr_path.value !== "" ? correctPath(radarr_path.value) : radarr_path.value,
    radarr_profile: radarr_profile_id.value,
    radarr_quality: radarr_profile_id.options[radarr_profile_id.value].text,
  });
}

function restoreOptions() {
  let restore = result => {
    if ([result.sonarr_url, result.sonarr_api].every(Boolean)) {
      getDropdownDataSonarr(result.sonarr_url, result.sonarr_api);
    }
    if ([result.radarr_url, result.radarr_api].every(Boolean)) {
      getDropdownDataRadarr(result.radarr_url, result.radarr_api);
    }

    sonarr_api.value = result.sonarr_api || "";
    radarr_api.value = result.radarr_api || "";
    sonarr_url.value = result.sonarr_url || "";
    radarr_url.value = result.radarr_url || "";
    sonarr_path.value = result.sonarr_path || "";
    radarr_path.value = result.radarr_path || "";
    sonarr_profile_id.value = result.sonarr_profile || 0;
    radarr_profile_id.value = result.radarr_profile || 0;
    sonarr_profile_id.options[0].text = result.sonarr_quality || "Choose Quality";
    radarr_profile_id.options[0].text = result.radarr_quality || "Choose Quality";
  };

  let getter = browser.storage.sync.get([
    "sonarr_api",
    "radarr_api",
    "sonarr_url",
    "radarr_url",
    "sonarr_path",
    "radarr_path",
    "sonarr_quality",
    "radarr_quality",
    "sonarr_profile",
    "radarr_profile",
  ]);
  getter.then(restore);
}

async function getDropdownDataSonarr(url, api) {

  let auth = {
    apikey: api,
  };
  let query = Object.keys(auth)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(auth[k]))
    .join("&");
  let urls = url.concat("/api/profile?") + query;

  fetch(urls, {
      method: "GET",
    })
    .then((data) => data.text())
    .then((json) => {
      var data = JSON.parse(json);
      let option;
      for (let i = 0; i < data.length; i++) {
        option = document.createElement("option");
        option.text = data[i].name;
        option.value = data[i].id;
        sonarr_profile_id.add(option);
      }
    })
    .catch(function (error) {
      console.log("request failed", error);
    });
}

async function getDropdownDataRadarr(url, api) {

  let auth = {
    apikey: api,
  };
  let query = Object.keys(auth)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(auth[k]))
    .join("&");
  let urls = url.concat("/api/profile?") + query;

  fetch(urls, {
      method: "GET",
    })
    .then((data) => data.text())
    .then((json) => {
      var data = JSON.parse(json);
      let option;
      for (let i = 0; i < data.length; i++) {
        option = document.createElement("option");
        option.text = data[i].name;
        option.value = data[i].id;
        radarr_profile_id.add(option);
      }
    })
    .catch(function (error) {
      console.log("request failed", error);
    });
}

window.addEventListener("beforeunload", saveOptions);
window.addEventListener("load", restoreOptions);
