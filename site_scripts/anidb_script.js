/*
 * Loading necessary data from website into global variables
 */
function loadData() {
  anime_title = document.querySelector("title").textContent.split(" -")[0];
  type = document.querySelector("tr.type > td.value").textContent.split(",")[0];
}

browser.runtime.onMessage.addListener((request) => {
  loadData();
  return Promise.resolve({ title: anime_title, media: type });
});
