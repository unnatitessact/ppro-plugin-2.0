import { IconType } from "react-icons";
import {
  SiFacebook,
  SiInstagram,
  SiX,
  SiYoutube,
  SiYoutubeshorts,
} from "react-icons/si";
import { create } from "zustand";

import { SocialMediaAccount } from "../api-integration/types/publishing";

export type SocialMedia =
  | "instagram-post"
  | "instagram-reel"
  | "youtube-video"
  | "twitter-post"
  | "facebook-post"
  | "youtube-shorts";

export type SocialMediaPlatform = {
  id: string;
  name: string;
  Icon: IconType;
  aspectRatio: string;
  allowedFileTypes: string[];
  key: string; // Add this if it's missing in the original type
};

export const socialMediaPlatforms = [
  {
    id: "instagram-post",
    name: "Instagram Post",
    Icon: SiInstagram,
    aspectRatio: "1:1",
    allowedFileTypes: ["ImageFile"],
  },
  {
    id: "instagram-reel",
    name: "Instagram Reel",
    Icon: SiInstagram,
    aspectRatio: "9:16",
    allowedFileTypes: ["VideoFile"],
  },
  {
    id: "youtube-video",
    name: "Youtube Video",
    Icon: SiYoutube,
    aspectRatio: "16:9",
    allowedFileTypes: ["VideoFile"],
  },
  {
    id: "twitter-post",
    name: "Twitter Post",
    Icon: SiX,
    aspectRatio: "1:1",
    allowedFileTypes: ["ImageFile", "VideoFile"],
  },
  {
    id: "Facebook post",
    name: "Facebook Post",
    Icon: SiFacebook,
    aspectRatio: "1:1",
    allowedFileTypes: ["ImageFile", "VideoFile"],
  },
  {
    id: "youtube-short",
    name: "Youtube Short",
    Icon: SiYoutubeshorts,
    aspectRatio: "9:16",
    allowedFileTypes: ["VideoFile"],
  },
];

interface PublishingState {
  isInstagramReelModalOpen: boolean;
  setIsInstagramReelModalOpen: (isInstagramReelModalOpen: boolean) => void;
  isInstagramPostModalOpen: boolean;
  setIsInstagramPostModalOpen: (isInstagramPostModalOpen: boolean) => void;
  isYoutubeVideoModalOpen: boolean;
  setIsYoutubeVideoModalOpen: (isYoutubeVideoModalOpen: boolean) => void;
  isYoutubeReelModalOpen: boolean;
  setIsYoutubeReelModalOpen: (isYoutubeReelModalOpen: boolean) => void;
  isYoutubeShortsModalOpen: boolean;
  setIsYoutubeShortsModalOpen: (isYoutubeShortsModalOpen: boolean) => void;

  selectedSocialMedia: SocialMedia | null;
  setSelectedSocialMedia: (selectedSocialMedia: SocialMedia | null) => void;
  selectedAccount: SocialMediaAccount | null;
  setSelectedAccount: (selectedAccount: SocialMediaAccount | null) => void;
  isCropVideoModalOpen: boolean;
  setIsCropVideoModalOpen: (isCropVideoModalOpen: boolean) => void;
  reset: () => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  timeIn: number | null;
  setTimeIn: (timeIn: number | null) => void;
  timeOut: number | null;
  setTimeOut: (timeOut: number | null) => void;
}

export const usePublishingStore = create<PublishingState>((set) => ({
  isInstagramReelModalOpen: false,
  setIsInstagramReelModalOpen: (isInstagramReelModalOpen) =>
    set({ isInstagramReelModalOpen }),
  isInstagramPostModalOpen: false,
  setIsInstagramPostModalOpen: (isInstagramPostModalOpen) =>
    set({ isInstagramPostModalOpen }),
  isYoutubeVideoModalOpen: false,
  setIsYoutubeVideoModalOpen: (isYoutubeVideoModalOpen) =>
    set({ isYoutubeVideoModalOpen }),
  isYoutubeReelModalOpen: false,
  setIsYoutubeReelModalOpen: (isYoutubeReelModalOpen) =>
    set({ isYoutubeReelModalOpen }),
  isYoutubeShortsModalOpen: false,
  setIsYoutubeShortsModalOpen: (isYoutubeShortsModalOpen) =>
    set({ isYoutubeShortsModalOpen }),

  selectedSocialMedia: null,
  setSelectedSocialMedia: (selectedSocialMedia) => set({ selectedSocialMedia }),
  selectedAccount: null,
  setSelectedAccount: (selectedAccount) => set({ selectedAccount }),
  isCropVideoModalOpen: false,
  zoom: 1,
  setZoom: (zoom) => set({ zoom }),
  timeIn: null,
  setTimeIn: (timeIn) => set({ timeIn }),
  timeOut: null,
  setTimeOut: (timeOut) => set({ timeOut }),
  setIsCropVideoModalOpen: (isCropVideoModalOpen) =>
    set({ isCropVideoModalOpen }),
  reset: () =>
    set({
      selectedSocialMedia: null,
    }),
}));
