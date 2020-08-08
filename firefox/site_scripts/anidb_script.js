/*
 * Loading necessary data from website
 */
function loadData() {
  let anime_title = document.querySelector('meta[property="og:title"]').content.split(" -")[0];
  let type = document.querySelector("tr.type > td.value").textContent.split(",")[0];
  return [anime_title, type];
}

browser.runtime.onMessage.addListener(() => {
  return Promise.resolve({
    title: loadData()[0],
    media: loadData()[1]
  });
});