"use client";

import { Dispatch, SetStateAction } from "react";

import { User } from "../api-integration/types/auth";
import {
  ExternalUser,
  ReviewCommentCreator,
  ReviewCommentSort,
} from "../api-integration/types/review";

import { COMBINATIONS } from "../constants/data-colors/data-colors";

export const TESSACT_AI_USER: User = {
  id: "tessact-ai",
  email: "Edit and generate clips with AI",
  profile: {
    first_name: "Tessact",
    last_name: "AI",
    display_name: "Tessact AI",
    profile_picture:
      "https://tessact-v18-static-files.s3.amazonaws.com/media/profile_pictures/1bb8c3ed-d5fd-403b-85fe-bc87dbfe6623.jpeg",
  },
};

export const bringTextToNextLine = ({
  text,
  setText,
  inputElement,
}: {
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  inputElement: HTMLTextAreaElement;
}) => {
  const mentionMarkup = text?.match(/(@)\[(.*?)\](\((.*?)\))/gm) || [];

  if (mentionMarkup?.length > 0) {
    const lastWordWithNewLine = text.trim().split(/\s+/).pop();
    const mentionRegex = /(@)\[(.*?)\]\((.*?)\)/;
    const isMarkup = mentionRegex.test(lastWordWithNewLine ?? "");
    if (isMarkup) {
      const newLineIndicator = "\n";
      const cursorPos = text.length;
      const newCursorPosition = cursorPos + newLineIndicator.length;
      setText(text + newLineIndicator);
      inputElement.setSelectionRange(newCursorPosition, newCursorPosition);
    } else {
      const newLineIndicator = "\n";
      const cursorPos = text.length;
      const newCursorPosition = cursorPos + newLineIndicator.length;
      setText(text + newLineIndicator);
      inputElement.setSelectionRange(newCursorPosition, newCursorPosition);
    }
  } else {
    const newLineIndicator = "\n";
    const cursorPos = text.length;
    const newCursorPosition = cursorPos + newLineIndicator.length;
    setText(text + newLineIndicator);
    inputElement.setSelectionRange(newCursorPosition, newCursorPosition);
  }
};

export const sortOptions: { key: ReviewCommentSort; label: string }[] = [
  { key: "created_on", label: "Oldest on top" },
  { key: "-created_on", label: "Newest on top" },
  { key: "in_time", label: "Timecode" },
  { key: "created_by__profile__display_name", label: "Commenter" },
];

export const stringToNumber = (str: string) => {
  return str.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
};

export const getColorFromEmail = (email: string) => {
  return COMBINATIONS[stringToNumber(email) % COMBINATIONS.length];
};

export const getCommentCreator = (
  createdBy: User | null,
  externalUser: ExternalUser | null
): ReviewCommentCreator => {
  if (externalUser) {
    return {
      display_name: externalUser.display_name,
      email: externalUser.email,
      color: getColorFromEmail(externalUser.email),
    };
  }

  return {
    display_name: createdBy?.profile.display_name ?? "",
    email: createdBy?.email ?? "",
    profile_picture: createdBy?.profile.profile_picture ?? "",
    color:
      createdBy?.profile.color ??
      getColorFromEmail(createdBy?.email ?? "") ??
      "",
  };
};
