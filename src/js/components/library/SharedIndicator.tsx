import { SharedStatus } from "../../api-integration/types/library";
import { Globus, Group3 } from "@tessact/icons";

import { PublicPrivateShareIcon } from "@tessact/tessact-icons";

export const SharedIndicator = ({
  sharedStatus,
}: {
  sharedStatus: SharedStatus;
}) => {
  if (sharedStatus === "public") {
    return <Globus size={20} />;
  }
  if (sharedStatus === "private") {
    return <Group3 size={20} />;
  }
  if (sharedStatus === "public_and_private") {
    return <PublicPrivateShareIcon />;
  }
};
