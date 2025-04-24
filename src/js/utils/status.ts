import { FileStatus, IndexStatus } from "../api-integration/types/library";

export const getLabelFromFileStatus = (status: FileStatus) => {
  switch (status) {
    case "not_started":
      return "Not started";
    case "needs_edit":
      return "Needs edit";
    case "processed":
      return "Processed";
    case "in_progress":
      return "In progress";
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
  }
};

export const getLabelFromIndexStatus = (
  status: IndexStatus,
  percent?: number
) => {
  switch (status) {
    case "queued":
      return "Queued";
    case "in_progress":
      return percent ? `${Math.round(percent)}% Analyzed` : "Analyzing";
    case "completed":
      return "Analyzed";
    case "failed":
      return "Not Analyzed";
    case "transcoding":
      return percent ? `${Math.round(percent)}% Transcoded` : "Transcoding";
    case "corrupted":
      return "Corrupted";
  }
};
