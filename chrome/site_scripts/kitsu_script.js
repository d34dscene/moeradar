/*
 * Loading necessary data from website into global variables
 */
function loadData() {
  anime_title = document.querySelector('meta[property="og:title"]')["content"];
  type = document
    .querySelector('meta[property="og:type"]')
    ["content"].replace("video.", "");
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  loadData();
  sendResponse({ title: anime_title, media: type });
});