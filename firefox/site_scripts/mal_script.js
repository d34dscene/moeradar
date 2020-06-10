/*
 * Loading necessary data from website into global variables
 */
function loadData() {
  anime_title = document
    .querySelector("title")
    .text.split(" -")[0]
    .replaceAll("\n", "");
  type = document
    .querySelector('meta[property="og:type"]')
    ["content"].split(".")[1];
}

browser.runtime.onMessage.addListener((request) => {
  loadData();
  return Promise.resolve({ title: anime_title, media: type });
});
