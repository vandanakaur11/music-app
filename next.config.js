const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

const path = require("path");

module.exports = (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      reactStrictMode: true,
      images: {
        domains: [
          "http://localhost:5000",
          "musicfilesforheroku.s3.us-west-1.amazonaws.com",
        ],
      },
      env: {
        base_url: "http://localhost:5000/api",
        media_url:
          "https://musicfilesforheroku.s3.us-west-1.amazonaws.com/uploads",
      },
      httpAgentOptions: {
        keepAlive: true,
      },
      sassOption: {
        includePaths: [path.join(__dirname, "styles")],
      },
    };
  }

  return {
    reactStrictMode: true,
    images: {
      domains: [
        "ian-mulder-music.herokuapp.com",
        "musicfilesforheroku.s3.us-west-1.amazonaws.com",
      ],
    },
    // images: { domains: ["localhost", "musicfilesforheroku.s3.us-west-1.amazonaws.com"] },
    env: {
      base_url: "https://ian-mulder-music.herokuapp.com/api",
      media_url:
        "https://musicfilesforheroku.s3.us-west-1.amazonaws.com/uploads",
      // base_url: "https://music-appps.herokuapp.com/api",
      // media_url: "https://music-appps.herokuapp.com",
      httpAgentOptions: {
        keepAlive: true,
      },
    },
    sassOption: {
      includePaths: [path.join(__dirname, "styles")],
    },
  };
};
