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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  loadData();
  sendResponse({ title: anime_title, media: type });
});