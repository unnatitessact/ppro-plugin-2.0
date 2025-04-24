// import React, { useEffect, useRef } from "react";

// import NotificationIcon from "@/components/notifications/NotificationIcon";
// import NotificationText from "@/components/notifications/NotificationText";

// import { NotificationRoomEventData } from "@/api-integration/types/notifications";

// const NotificationItem = ({
//   notification,
//   isSelected,
// }: {
//   notification: NotificationRoomEventData;
//   isSelected?: boolean;
// }) => {
//   const divRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (isSelected && divRef.current) {
//       divRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
//     }
//   }, [isSelected]);

//   return (
//     <div
//       ref={divRef}
//       className="grid h-auto w-full grid-cols-[40px,auto] items-start gap-3 overflow-hidden  px-4 py-3"
//     >
//       <NotificationIcon notificationData={notification} />
//       <NotificationText notificationData={notification} showTime />
//     </div>
//   );
// };

// export default NotificationItem;
