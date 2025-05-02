import { Presence, useOthers } from "../../../../liveblocks.config";

import { Avatar } from "@/components/ui/Avatar";
import { NextAvatar } from "@/components/ui/NextAvatar";

interface CollaborativeAvatarGroupProps {
  other: Presence;
  left: number;
}

const PresentAvatars = ({ other }: { other: Presence }) => {
  const otherFollowers = useOthers((others) =>
    others
      .filter((other) => other.presence.leaderId === other.presence.id)
      .map((other) => other.presence)
  );

  if (otherFollowers.length > 0) {
    return (
      <div className="relative flex">
        {/* <Tooltip
          placement="top"
          key={other.id}
          content={<TooltipContent other={other} duration={duration} />}
        > */}
        <Avatar size="xs" src={other.avatar} />
        {/* </Tooltip> */}

        {otherFollowers.length > 2 ? (
          <div>
            <NextAvatar
              width={24}
              height={24}
              src={otherFollowers[0].avatar}
              alt={otherFollowers[0].name}
              key={otherFollowers[0].id}
              userFallbackProps={{
                email: otherFollowers[0].email,
                color: otherFollowers[0].color,
                displayName: otherFollowers[0].name,
              }}
              style={{ zIndex: 1, left: `${16}px`, position: "absolute" }}
            />
            {/* <Tooltip
              content={
                <div className="flex flex-col gap-2">
                  {otherFollowers.map((follower) => (
                    <div className="flex items-center gap-2" key={follower.id}>
                      <Avatar size="cursor" src={follower.avatar} />
                      <p>{follower.name}</p>
                    </div>
                  ))}
                </div>
              }
            > */}
            <Avatar
              size="xs"
              name={`+${otherFollowers.length - 1}`}
              key={otherFollowers[1].id}
              style={{ zIndex: 2, left: `${32}px`, position: "absolute" }}
            />
            {/* </Tooltip> */}
          </div>
        ) : (
          otherFollowers.map((follower, index) => (
            <NextAvatar
              width={24}
              height={24}
              src={otherFollowers[0].avatar}
              alt={otherFollowers[0].name}
              userFallbackProps={{
                email: otherFollowers[0].email,
                color: otherFollowers[0].color,
                displayName: otherFollowers[0].name,
              }}
              key={follower.id}
              style={{
                zIndex: index + 1,
                left: `${(index + 1) * 16}px`,
                position: "absolute",
              }}
            />
          ))
        )}
      </div>
    );
  } else if (other.leaderId) {
    return null;
  } else {
    return (
      // <Tooltip
      //   placement="top"
      //   // isOpen={true}
      //   key={other.id}
      //   content={<TooltipContent other={other} duration={duration} />}
      // >
      <div>
        <NextAvatar
          width={24}
          height={24}
          src={other.avatar}
          alt={other.name}
          userFallbackProps={{
            email: other.email,
            color: other.color,
            displayName: other.name,
          }}
        />
      </div>
      // </Tooltip>
    );
  }
};

// const TooltipContent = ({ other, duration }: { other: Presence; duration: number }) => {
//   // const { setGoToTime, setCurrentTime, timecode } = useVideo();
//   const updateMyPresence = useUpdateMyPresence();
//   const leaderId = useSelf((self) => self.presence.leaderId);
//   const {
//     playerState: { timeFormat, fps }
//   } = usePlayerContext();

//   const isAlreadyFollowingThisPerson = leaderId === other.id;

//   const toggleFollow = () => {
//     // const ifYouIAreFollowingMe = self?.presence.followers?.find(
//     //   (follower) => follower.id === other.id
//     // );

//     // if (ifYouIAreFollowingMe) return;

//     // const isIAmAlreadyFollowingYou = self?.presence?.leader?.id === other.id;

//     // if (isIAmAlreadyFollowingYou) return;

//     // broadcast({
//     //   type: 'FOLLOW',
//     //   leaderId: other.id
//     // });

//     // const currentTimeOfLeader = other.currentTime;
//     // setGoToTime(currentTimeOfLeader);
//     // setCurrentTime(currentTimeOfLeader);
//     if (isAlreadyFollowingThisPerson) {
//       updateMyPresence({
//         leaderId: null
//       });
//     } else {
//       updateMyPresence({
//         leaderId: other.id
//       });
//     }
//   };

//   return (
//     <div className="flex items-center justify-between gap-2 px-3 py-2">
//       <div className="flex min-w-40 flex-col">
//         <p className="text-base font-medium text-ds-text-primary">{other.name}</p>
//         <p className="text-base-700 text-sm font-medium">
//           {renderValue(other.currentTime, timeFormat, fps)}
//           <span className="text-ds-text-secondary">
//             {' '}
//             / {renderValue(duration, timeFormat, fps)}
//           </span>
//         </p>
//       </div>

//       <Button onPress={toggleFollow} color="primary" isIconOnly size="sm">
//         {isAlreadyFollowingThisPerson ? (
//           <PeopleRemove size={16} className="cursor-pointer text-white" />
//         ) : (
//           <PeopleAdd className="text-white" size={16} />
//         )}
//       </Button>
//     </div>
//   );
// };

const CollaborativeAvatarGroup = ({
  other,
  left,
}: CollaborativeAvatarGroupProps) => {
  return (
    <div
      style={{
        left: `${left}%`,
      }}
      className="pointer-events-none absolute z-10 will-change-[left] -translate-x-1/2 transform-gpu"
    >
      <PresentAvatars other={other} />
    </div>
  );
};

export default CollaborativeAvatarGroup;
