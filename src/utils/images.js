const Image = require("@11ty/eleventy-img");

async function imageShortcode(name, src, alt, sizes) {
  //regex to clear the double quotes and back slashes of the string "\"Negro College.\".
  const regex = /(")/g;
  const regexAmp = /(amp;)/g;

  let metadata = await Image(src, {
    widths: [null],
    formats: ["png"],
    outputDir: "./_site/img/",
    sharpPngOptions: {
      progressive: true,
      palette: true,
    },
    filenameFormat: function (id, srcc, width, format, options) {
      const stripName = name.replace(regex, "'");
      const stripedName = stripName.replace(regexAmp, "");
      return `${stripedName}.${format}`;
    },
  });

  let imageAttributes = {
    alt: alt.replace(regex, "'"),
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = imageShortcode;
