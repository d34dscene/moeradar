var sonarr_url;
function saveOptions(e) {
  browser.storage.sync.set({
    sonarr_api: document.querySelector("#sonarr_api").value,
    sonarr_url: document.querySelector("#sonarr_url").value,
    sonarr_path: document.querySelector("#sonarr_path").value,
    sonarr_quality: document.querySelector("#sonarr_quality").value,
    radarr_api: document.querySelector("#radarr_api").value,
    radarr_url: document.querySelector("#radarr_url").value,
    radarr_path: document.querySelector("#radarr_path").value,
    radarr_quality: document.querySelector("#radarr_quality").value,
  });
  e.preventDefault();
  location.reload();
}

function restoreOptions() {
  function setCurrentChoice(result) {
    getDropdownDataSonarr(result.sonarr_url, result.sonarr_api);
    getDropdownDataRadarr(result.radarr_url, result.radarr_api);
    document.querySelector("#sonarr_api").value = result.sonarr_api || "";
    document.querySelector("#radarr_api").value = result.radarr_api || "";
    document.querySelector("#sonarr_url").value = result.sonarr_url || "";
    document.querySelector("#radarr_url").value = result.radarr_url || "";
    document.querySelector("#sonarr_path").value = result.sonarr_path || "";
    document.querySelector("#radarr_path").value = result.radarr_path || "";
    document.querySelector("#sonarr_quality").value =
      result.sonarr_quality || "0";
    document.querySelector("#radarr_quality").value =
      result.radarr_quality || "0";
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let getter = browser.storage.sync.get([
    "sonarr_api",
    "radarr_api",
    "sonarr_url",
    "radarr_url",
    "sonarr_path",
    "radarr_path",
    "sonarr_quality",
    "radarr_quality",
  ]);
  getter.then(setCurrentChoice, onError);
}

function getDropdownDataSonarr(url, api) {
  let sonarr_dropdown = document.getElementById("sonarr_quality");

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
        sonarr_dropdown.add(option);
      }
    })
    .catch(function (error) {
      console.log("request failed", error);
    });
}
function getDropdownDataRadarr(url, api) {
  let radarr_dropdown = document.getElementById("radarr_quality");

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
        radarr_dropdown.add(option);
      }
    })
    .catch(function (error) {
      console.log("request failed", error);
    });
}
document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
