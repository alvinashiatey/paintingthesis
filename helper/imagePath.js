const fs = require("fs");
const { join } = require("path");
const Arena = require("are.na");
const artists = require("../src/_data/artists.json");
require("dotenv").config();
let arena = new Arena({
        accessToken: process.env.ARENA_API
});

(async () => {
        try {
                let imageArray = [];
                let pageNumber = 1;
                let chanLength = true;
                do {
                        console.log(`Fetching page ${pageNumber}`);
                        let res = await arena
                                .channel("ppm-media-2")
                                .get({ page: pageNumber, per: 100 })
                                .then(async (chan) => {
                                        chan.contents.map(async (item) => {
                                                if (item.image === null) return;
                                                let folderNameArr =
                                                        item.title.split("-");
                                                let fileName =
                                                        item.title.replace(
                                                                /\.[^/.]+$/,
                                                                ""
                                                        );
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
                                                imageArray.push(
                                                        getCaption(
                                                                fileName,
                                                                `artists/${folderName}/images/${fileName}.jpg`
                                                        )
                                                );
                                        });
                                        return {
                                                data: imageArray,
                                                length: chan.contents.length
                                        };
                                })
                                .catch((err) => console.log(err.message));
                        res.length ? (pageNumber += 1) : (chanLength = false);
                } while (chanLength);
                fs.writeFileSync(
                        join(__dirname, "../src/images.json"),
                        JSON.stringify({ data: imageArray }, null, 2)
                );
        } catch (e) {
                console.log(e.message);
        }
})();

function getCaption(fileName, path) {
        let res;
        let fName = fileName.split("-").join(" ");
        let images = artists.map((artist) => {
                return artist.images;
        });
        images = Object.assign({}, ...images);
        for (let imageKey in images) {
                if (imageKey.toLowerCase() === fName.toLowerCase()) {
                        let caption = images[imageKey];
                        images[imageKey] = {
                                name: imageKey,
                                caption: caption,
                                path
                        };
                        res = images[imageKey];
                }
        }
        return res;
}
