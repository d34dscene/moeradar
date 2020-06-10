/*
 * Loading necessary data from website into global variables
 */
function loadData() {
  anime_title = document
    .querySelector('div[class="content"]>h1')
    .textContent.replace(/(\t|\r\n|\n|\r)/gm, "");
  type = document
    .querySelector('div[class="data-set"]')
    .childNodes[2].textContent.replace(/(\t|\r\n|\n|\r)/gm, "");
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  loadData();
  sendResponse({ title: anime_title, media: type });
});
