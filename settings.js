function correctPath(path) {
  if (!path.endsWith("/") && path != "") {
    return path.concat("/");
  }
  return path;
}
function correctUrl(url) {
  if (!url.startsWith("http://") && !url.startsWith("https://") && url != "") {
    return "http://" + url;
  }
  return url;
}

function saveOptions() {
  let sUrl = correctUrl(document.querySelector("#sonarr_url").value);
  let rUrl = correctUrl(document.querySelector("#radarr_url").value);
  let sPath = correctPath(document.querySelector("#sonarr_path").value);
  let rPath = correctPath(document.querySelector("#radarr_path").value);
  browser.storage.sync.set({
    sonarr_api: document.querySelector("#sonarr_api").value,
    sonarr_url: sUrl,
    sonarr_path: sPath,
    sonarr_profile: document.querySelector("#sonarr_quality").value,
    sonarr_quality: document.querySelector("#sonarr_quality").options[
      document.querySelector("#sonarr_quality").value
    ].text,

    radarr_api: document.querySelector("#radarr_api").value,
    radarr_url: rUrl,
    radarr_path: rPath,
    radarr_profile: document.querySelector("#radarr_quality").value,
    radarr_quality: document.querySelector("#radarr_quality").options[
      document.querySelector("#radarr_quality").value
    ].text,
  });
}

function restoreOptions() {
  function setCurrentChoice(result) {
    if ([result.sonarr_url, result.sonarr_api].every(Boolean)) {
      getDropdownDataSonarr(result.sonarr_url, result.sonarr_api);
    }
    if ([result.radarr_url, result.radarr_api].every(Boolean)) {
      getDropdownDataRadarr(result.radarr_url, result.radarr_api);
    }

    document.querySelector("#sonarr_api").value = result.sonarr_api || "";
    document.querySelector("#radarr_api").value = result.radarr_api || "";
    document.querySelector("#sonarr_url").value = result.sonarr_url || "";
    document.querySelector("#radarr_url").value = result.radarr_url || "";
    document.querySelector("#sonarr_path").value = result.sonarr_path || "";
    document.querySelector("#radarr_path").value = result.radarr_path || "";
    document.querySelector("#sonarr_quality").options[0].text =
      result.sonarr_quality || "Choose Quality";
    document.querySelector("#radarr_quality").options[0].text =
      result.radarr_quality || "Choose Quality";
    document.querySelector("#sonarr_quality").value = result.sonarr_profile;
    document.querySelector("#radarr_quality").value = result.radarr_profile;
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
    "sonarr_profile",
    "radarr_profile",
  ]);
  getter.then(setCurrentChoice, onError);
}
async function getDropdownDataSonarr(url, api) {
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

document.addEventListener("submit", saveOptions);
window.addEventListener("load", restoreOptions);
