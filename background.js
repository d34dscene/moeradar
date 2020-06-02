function onCreated(tab) {
  console.log(`Created new tab: ${tab.id}`);
}

function onError(error) {
  console.log(`Error: ${error}`);
}

browser.browserAction.onClicked.addListener(function () {
  var creating = browser.tabs.create({
    url: "settings.html",
  });
  creating.then(onCreated, onError);
});

function trigger(tabs) {
  for (let tab of tabs) {
    browser.tabs
      .sendMessage(tab.id, { send: "" })
      .then((response) => {
        console.log(response.response);
      })
      .catch(onError);
  }
}

browser.commands.onCommand.addListener(function (command) {
  if (command == "toggle-feature") {
    browser.tabs
      .query({
        currentWindow: true,
        active: true,
      })
      .then(trigger)
      .catch(onError);
  }
});
