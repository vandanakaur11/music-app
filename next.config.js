const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

const path = require("path");

module.exports = (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      reactStrictMode: true,
      images: {
        domains: [
          "localhost:5000",
          // "musicfilesforheroku.s3.us-west-1.amazonaws.com",
          "musicfilesforianmulder.s3.us-west-1.amazonaws.com",
        ],
      },
      env: {
        base_url: "http://localhost:5000",
        // media_url:
        //   "https://musicfilesforheroku.s3.us-west-1.amazonaws.com/uploads",
        media_url:
          "https://musicfilesforianmulder.s3.us-west-1.amazonaws.com/uploads",
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
        "music-app-backend-alpha.vercel.app",
        // "musicfilesforheroku.s3.us-west-1.amazonaws.com",
        "musicfilesforianmulder.s3.us-west-1.amazonaws.com",
      ],
    },
    // images: { domains: ["localhost", "musicfilesforheroku.s3.us-west-1.amazonaws.com"] },
    env: {
      base_url: "https://music-app-backend-alpha.vercel.app",
      // media_url:
      //   "https://musicfilesforheroku.s3.us-west-1.amazonaws.com/uploads",
      media_url:
        "https://musicfilesforianmulder.s3.us-west-1.amazonaws.com/uploads",
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
