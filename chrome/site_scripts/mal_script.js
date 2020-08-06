/*
 * Loading necessary data from website
 */
function loadData() {
  let anime_title = document
    .querySelector("title")
    .text.split(" -")[0]
    .replaceAll("\n", "");
  let type = document
    .querySelector('meta[property="og:type"]')["content"].split(".")[1];
  return [anime_title, type];
}

browser.runtime.onMessage.addListener((request) => {
  return Promise.resolve({
    title: loadData()[0],
    media: loadData()[1]
  });
});