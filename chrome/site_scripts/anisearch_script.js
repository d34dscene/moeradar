/*
 * Loading necessary data from website
 */
function loadData() {
  let anime_title = document
    .querySelector('meta[property="og:title"]')["content"].replaceAll('"', "")
    .split(" (")[0];
  let type = document
    .getElementById("infodetails")
    .getElementsByTagName("li")[0]
    .innerHTML.split("</span>")[1];
  return [anime_title, type];
}

browser.runtime.onMessage.addListener((request) => {
  return Promise.resolve({
    title: loadData()[0],
    media: loadData()[1]
  });
});