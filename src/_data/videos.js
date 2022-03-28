const { AssetCache } = require("@11ty/eleventy-cache-assets");
const Arena = require("are.na");
require("dotenv").config();
let arena = new Arena({
  accessToken: process.env.ARENA_API,
});

module.exports = async function () {
  try {
    let asset = new AssetCache("videos");
    let videoJSON = [];
    if (asset.isCacheValid("1d")) {
      // return cached data.
      return asset.getCachedValue(); // a promise
    }
    let pageNumber = 1;
    let chanLength = true;
    do {
      console.log(`Fetching page ${pageNumber}`);
      let res = await arena
        .channel("ppm-media-2")
        .get({ page: pageNumber, per: 100 })
        .then(async (chan) => {
          chan.contents.map(async (item) => {
            if (item.image) return;
            if (item.attachment) {
              let videoURL = {
                title: item.title,
                url: item.attachment.url,
              };
              videoJSON.push(videoURL);
            }
          });

          await asset.save(videoJSON, "json");
          return { data: videoJSON, length: chan.contents.length };
        })
        .catch((err) => console.log(err.message));
      res.length ? (pageNumber += 1) : (chanLength = false);
    } while (chanLength);
    return videoJSON;
  } catch (e) {
    console.log(e.message);
  }
};
