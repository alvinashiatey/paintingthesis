const Image = require("@11ty/eleventy-img");
const path = require("path");

async function imageShortcode(
  relativeSrc,
  alt,
  cls,
  widths = [1280],
  formats = ["jpeg"],
  sizes = "100vw"
) {
  try {
    const { dir: imgDir } = path.parse(relativeSrc);
    const fullSrc = path.join("src", relativeSrc);
    let metadata = await Image(fullSrc, {
      widths,
      formats,
      outputDir: path.join("_site", imgDir),
      urlPath: imgDir,
      sharpPngOptions: {
        progressive: true,
        palette: true,
      },
    });

    let highSrc = metadata.jpeg[0];
    let imageAttributes = {
      alt,
      sizes,
      class: cls,
      height: null,
    };
    // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
    // return Image.generateHTML(metadata, imageAttributes);
    return `<img src="${highSrc.url}" alt="${alt}" class="${cls}" width="${highSrc.width}" />`;
  } catch (e) {
    console.error("Image:error", e.message);
  }
}

module.exports = imageShortcode;
