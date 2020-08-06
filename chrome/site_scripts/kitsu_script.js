/*
 * Loading necessary data from website
 */
function loadData() {
  let anime_title = document.querySelector('meta[property="og:title"]')["content"];
  let type = document
    .querySelector('meta[property="og:type"]')["content"].replace("video.", "");
  return [anime_title, type];
}

browser.runtime.onMessage.addListener((request) => {
  return Promise.resolve({
    title: loadData()[0],
    media: loadData()[1]
  });
});