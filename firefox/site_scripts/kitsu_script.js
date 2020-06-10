/*
 * Loading necessary data from website into global variables
 */
function loadData() {
  anime_title = document.querySelector('meta[property="og:title"]')["content"];
  type = document
    .querySelector('meta[property="og:type"]')
    ["content"].replace("video.", "");
}

browser.runtime.onMessage.addListener((request) => {
  loadData();
  return Promise.resolve({ title: anime_title, media: type });
});
