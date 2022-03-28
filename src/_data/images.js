const { AssetCache } = require("@11ty/eleventy-cache-assets");
const Cache = require("@11ty/eleventy-cache-assets");
const Arena = require("are.na");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
let arena = new Arena({
        accessToken: process.env.ARENA_API
});

module.exports = async function () {
        let pageNumber = 1;
        let chanLength = true;
        try {
                do {
                        let cl = await arena
                                .channel("ppm-media-2")
                                .get({ page: pageNumber, per: 200 })
                                .then(async (chan) => {
                                        chan.contents.map(async (item) => {
                                                if (item.image === null) return;
                                                let url =
                                                        item.image.original.url;
                                                let imageBuffer = await Cache(
                                                        url,
                                                        {
                                                                duration: "1d",
                                                                type: "buffer"
                                                        }
                                                );
                                                let folderNameArr =
                                                        item.title.split("-");
                                                let fileName =
                                                        item.title.replace(
                                                                /\.[^/.]+$/,
                                                                ""
                                                        );
                                                let removeDigit =
                                                        folderNameArr.shift();
                                                let folderName;
                                                if (folderNameArr.length <= 2) {
                                                        folderName = `${
                                                                folderNameArr[0]
                                                        }-${folderNameArr
                                                                .pop()
                                                                .replace(
                                                                        /\.[^/.]+$/,
                                                                        ""
                                                                )}`;
                                                } else {
                                                        let lastEl =
                                                                folderNameArr.pop();
                                                        folderName = `${folderNameArr.join(
                                                                "-"
                                                        )}-${lastEl.replace(
                                                                /\.[^/.]+$/,
                                                                ""
                                                        )}`;
                                                }
                                                let imageDir = `_site/artists/${folderName}/images/`;
                                                if (!fs.existsSync(imageDir)) {
                                                        fs.mkdir(
                                                                imageDir,
                                                                {
                                                                        recursive: true
                                                                },
                                                                (err) => {
                                                                        if (err)
                                                                                throw err;
                                                                        sharp(
                                                                                imageBuffer
                                                                        )
                                                                                .resize(
                                                                                        {
                                                                                                width: 1400
                                                                                        }
                                                                                )
                                                                                .toFile(
                                                                                        `${imageDir}${fileName}.jpg`
                                                                                );
                                                                }
                                                        );
                                                } else {
                                                        sharp(imageBuffer)
                                                                .resize({
                                                                        width: 1400
                                                                })
                                                                .toFile(
                                                                        `${imageDir}${fileName}.jpg`
                                                                );
                                                }
                                        });
                                        return chan.contents.length;
                                })
                                .catch((err) => console.log(err.message));
                        cl ? (pageNumber += 1) : (chanLength = false);
                } while (chanLength);
        } catch (e) {
                console.log(e.message);
        }
};
