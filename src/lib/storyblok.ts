import { apiPlugin, storyblokInit } from "@storyblok/react/rsc";

export const getStoryblokApi = storyblokInit({
  accessToken: "https://api.storyblok.com/v2/cdn",
  use: [apiPlugin],
  apiOptions: {
    region: "eu",
  },
});
