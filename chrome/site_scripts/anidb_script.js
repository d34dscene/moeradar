/*
 * Loading necessary data from website
 */
function loadData() {
  let anime_title = document.querySelector("title").textContent.split(" -")[0];
  let type = document.querySelector("tr.type > td.value").textContent.split(",")[0];
  return [anime_title, type];
}

browser.runtime.onMessage.addListener((request) => {
  return Promise.resolve({
    title: loadData()[0],
    media: loadData()[1]
  });
});