/*
 * Loading necessary data from website into global variables
 */
function loadData() {
  anime_title = document.querySelector("title").textContent.split(" -")[0];
  type = document.querySelector("tr.type > td.value").textContent.split(",")[0];
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  loadData();
  sendResponse({ title: anime_title, media: type });
});