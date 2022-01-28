const { AssetCache } = require("@11ty/eleventy-cache-assets");
const Cache = require("@11ty/eleventy-cache-assets");
const Arena = require("are.na");
const sharp = require("sharp");
var fs = require("fs");
require("dotenv").config();
let arena = new Arena({
  accessToken: process.env.ARENA_API,
});

module.exports = async function () {
  try {
    arena
      .channel("ppm-media-7_ey3tydmye")
      .get({ per: 100 })
      .then(async (chan) => {
        chan.contents.map(async (item) => {
          if (item.image === null) return;
          let url = item.image.original.url;
          let imageBuffer = await Cache(url, {
            duration: "1d",
            type: "buffer",
          });
          let folderNameArr = item.title.split("-");
          //remove trailing extension from item.title. Where fileName "01-foo-boo.jpeg" becomes "01-foo-boo".
          let fileName = item.title.replace(/\.[^/.]+$/, "");
          let removeDigit = folderNameArr.shift();
          let folderName;
          if (folderNameArr.length <= 2) {
            folderName = `${folderNameArr[0]}-${folderNameArr
              .pop()
              .replace(/\.[^/.]+$/, "")}`;
          } else {
            let lastEl = folderNameArr.pop();
            folderName = `${folderNameArr.join("-")}-${lastEl.replace(
              /\.[^/.]+$/,
              ""
            )}`;
          }
          let imageDir = `_site/artists/${folderName}/images/`;
          if (!fs.existsSync(imageDir)) {
            fs.mkdir(imageDir, { recursive: true }, (err) => {
              if (err) throw err;
              sharp(imageBuffer)
                .resize({
                  width: 2000,
                })
                .toFile(`${imageDir}${fileName}.jpg`);
            });
          } else {
            sharp(imageBuffer)
              .resize({
                width: 2000,
              })
              .toFile(`${imageDir}${fileName}.jpg`);
          }
        });
      })
      .catch((err) => console.log(err.message));
  } catch (e) {
    console.log(e.message);
  }
};
