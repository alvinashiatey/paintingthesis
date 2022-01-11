async function videoShortCode(array, title) {
  try {
    // find the object in the array that has the title property that matches title
    const video = array.find((v) => v.title === title);
    // // if the video object is not found, return an empty string
    if (!video) {
      return "";
    }
    // if the video object is found, return the video object
    let videoURL = video.url;
    if (videoURL) {
      return `<video controls><source src="${videoURL}" type="video/mp4"></video>`;
    }
  } catch (e) {
    console.error("videoShortCode:error", e.message);
  }
}

module.exports = videoShortCode;
