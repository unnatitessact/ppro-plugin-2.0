import { Suspense } from "react";

// import dynamic from 'next/dynamic';

import { useComments } from "@/context/comments";

import { MentionsInputProps } from "@/components/ui/mentions/Mentions";

import { useWorkspace } from "@/hooks/useWorkspace";

import { Mentions } from "@/components/ui/mentions/Mentions";

// const Mentions = dynamic(
//   () => import('@/components/ui/mentions/Mentions').then((mod) => mod.Mentions),
//   {
//     ssr: false
//   }
// );

export const ReviewMentions = (
  props: Omit<MentionsInputProps, "users" | "hashtags">
) => {
  const { hashtags } = useComments();
  const { members } = useWorkspace();

  return (
    <Suspense fallback={<></>}>
      <Mentions users={members} hashtags={hashtags} {...props} />
    </Suspense>
  );
};

ReviewMentions.displayName = "ReviewMentions";
