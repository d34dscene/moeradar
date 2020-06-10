/*
 * Loading necessary data from website into global variables
 */
function loadData() {
  anime_title = document
    .querySelector('meta[property="og:title"]')
    ["content"].replaceAll('"', "")
    .split(" (")[0];
  type = document
    .getElementById("infodetails")
    .getElementsByTagName("li")[0]
    .innerHTML.split("</span>")[1];
}

browser.runtime.onMessage.addListener((request) => {
  loadData();
  return Promise.resolve({ title: anime_title, media: type });
});
