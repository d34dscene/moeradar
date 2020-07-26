/*
 * Loading necessary data from website
 */
function loadData() {
  let anime_title = document
    .querySelector('div[class="content"]>h1')
    .textContent.replace(/(\t|\r\n|\n|\r)/gm, "");
  let type = document
    .querySelector('div[class="data-set"]')
    .childNodes[2].textContent.replace(/(\t|\r\n|\n|\r)/gm, "");
  console.log(anime_title, type);
  return [anime_title, type];
}

browser.runtime.onMessage.addListener((request) => {
  return Promise.resolve({
    title: loadData()[0],
    media: loadData()[1]
  });
});