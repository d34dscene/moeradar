/*
 * Loading necessary data from website
 */
function loadData() {
  let anime_title = document.querySelector('meta[property="og:title"]').content;
  let type = document
    .querySelector('div[class="data-set"]')
    .childNodes[2].textContent.replace(/(\t|\r\n|\n|\r)/gm, "");
  return [anime_title, type];
}

browser.runtime.onMessage.addListener(() => {
  return Promise.resolve({
    title: loadData()[0],
    media: loadData()[1]
  });
});