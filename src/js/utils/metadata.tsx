import type { MetadataFieldType } from "../api-integration/types/metadata";

import {
  CircleStatusDottedIcon,
  TriangleDottedIcon,
} from "@tessact/tessact-icons";
import { Rating } from "react-simple-star-rating";

import {
  BulletList,
  CalendarDays,
  Checklist,
  Code,
  CodeInsert,
  Hashtag,
  PageText,
  Paperclip2,
  People,
  Pin,
  SettingsToggle1,
  Star,
  TextSize,
} from "@tessact/icons";

import { User } from "../components/library/metadata/User";

export const fieldTypes: {
  label: string;
  type: MetadataFieldType;
  icon: React.ReactNode;
}[] = [
  {
    label: "Text",
    type: "text",
    icon: <TextSize size={20} />,
  },
  {
    label: "Numeric",
    type: "number",
    icon: <Hashtag size={20} />,
  },
  {
    label: "Date",
    type: "date",
    icon: <CalendarDays size={20} />,
  },
  {
    label: "Text Area",
    type: "text_area",
    icon: <PageText size={20} />,
  },
  {
    label: "Person",
    type: "person",
    icon: <People size={20} />,
  },
  {
    label: "Location",
    type: "location",
    icon: <Pin size={20} />,
  },
  {
    label: "Multi Select",
    type: "multiselect",
    icon: <Checklist size={20} />,
  },
  {
    label: "Timecode",
    type: "timecode",
    icon: <CodeInsert size={20} />,
  },
  {
    label: "Timecode Range",
    type: "timecode_range",
    icon: <Code size={20} />,
  },
  {
    label: "Select",
    type: "select",
    icon: <BulletList size={20} />,
  },
  {
    label: "Rating",
    type: "rating",
    icon: <Star size={20} />,
  },
  {
    label: "Toggle",
    type: "toggle",
    icon: <SettingsToggle1 size={20} />,
  },
  {
    label: "File",
    type: "attachment",
    icon: <Paperclip2 size={20} />,
  },
];

export const getIconFromType = (type: MetadataFieldType, size = 24) => {
  switch (type) {
    case "text":
      return <TextSize size={size} />;
    case "number":
      return <Hashtag size={size} />;
    case "date":
      return <CalendarDays size={size} />;
    case "text_area":
      return <PageText size={size} />;
    case "person":
      return <People size={size} />;
    case "location":
      return <Pin size={size} />;
    case "multiselect":
      return <Checklist size={size} />;
    case "timecode":
      return <CodeInsert size={size} />;
    case "timecode_range":
      return <Code size={size} />;
    case "select":
      return <BulletList size={size} />;
    case "rating":
      return <Star size={size} />;
    case "toggle":
      return <SettingsToggle1 size={size} />;
    case "attachment":
      return <Paperclip2 size={size} />;
    case "file_status":
      return <CircleStatusDottedIcon height={size} width={size} />;
    case "tagging_status":
      return <TriangleDottedIcon height={size} width={size} />;
  }
};

export const getLabelFromType = (type: MetadataFieldType) => {
  switch (type) {
    case "text":
      return "Text";
    case "number":
      return "Numeric";
    case "date":
      return "Date";
    case "text_area":
      return "Text Area";
    case "person":
      return "Person";
    case "location":
      return "Location";
    case "multiselect":
      return "Multi Select";
    case "timecode":
      return "Timecode";
    case "timecode_range":
      return "Timecode Range";
    case "select":
      return "Select";
    case "rating":
      return "Rating";
    case "toggle":
      return "Toggle";
    case "attachment":
      return "File Attachment";
  }
};

export const getPlaceholderValueFromType = (type: MetadataFieldType) => {
  switch (type) {
    case "text":
      return "Wedding shoot";
    case "number":
      return "3.4";
    case "date":
      return "12th Feb 2024";
    case "text_area":
      return "A heartwarming wedding shoot captures the couple's love through candid moments and posed portraits in a picturesque setting. From the stunning attire to the first dance, the photographer encapsulates the emotion and significance of each moment, creating a timeless visual narrative.";
    case "person":
      return <User name="Naveen" image="/profile-image.png" size="lg" />;
    case "location":
      return "St. Louis, Missouri";
    case "multiselect":
      return "Wedding, Portrait";
    case "timecode":
      return "00:00:00";
    case "timecode_range":
      return "00:00:00 - 00:00:00";
    case "select":
      return "Wedding";
    case "rating":
      return (
        <Rating
          initialValue={4}
          readonly
          size={20}
          SVGclassName="inline-flex"
        />
      );
    case "toggle":
      return "true";
    case "attachment":
      return "image.jpg";
  }
};
