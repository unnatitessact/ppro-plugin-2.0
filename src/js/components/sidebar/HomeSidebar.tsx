// import { useRouter, useSearchParams } from 'next/navigation';

import { motion } from "framer-motion";

import {
  // BoxSparkle,
  //  CainLink2,
  MagnifyingGlass,
} from "@tessact/icons";

// import { NavLink } from '@/components/NavLink';
// import { SearchKbd } from "@/components/search/utils-component/SearchKbd";
import { transition } from "@/components/layout/Sidebar";
import { UploadLimitIndicator } from "@/components/UploadLimitIndicator";
import { NavLink } from "@/components/layout/Navlink";
import { useFeatureToggle } from "@/hooks/useFeatureToggle";

// import { useFeatureFlag } from '@/hooks/useFeatureFlag';
// import { REMIXES_FLAG } from '@/utils/featureFlagUtils';

import { useSearchStore } from "@/stores/search-store";

import { internalLinks, links, taggingLinks } from "@/constants/links";

export const HomeSidebar = ({
  isUserTagger,
  isInternalUser,
}: {
  isUserTagger: boolean;
  isInternalUser: boolean;
}) => {
  const { setIsSearchOpen } = useSearchStore();

  //   const router = useRouter();
  //   const searchParams = useSearchParams();

  //   const hasSearchParam = searchParams.get("search");

  const showUploadLimitIndicator = useFeatureToggle([
    "production",
    "staging",
    "dev",
  ]);

  return (
    <motion.div
      className="flex flex-col gap-3"
      initial={{ opacity: 0, x: "-100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "-100%", position: "absolute" }}
      transition={transition}
    >
      <motion.div layout>
        {!isUserTagger && (
          <NavLink
            label="Search"
            layoutIdPrefix="home"
            icon={<MagnifyingGlass size={20} />}
            onClick={() => {
              //   if (!hasSearchParam) {
              // router.replace("?search=true");
              //   }
              setIsSearchOpen(true);
            }}
            // endContent={<SearchKbd keys={["mod", "K"]} />}
          />
        )}
        {(isUserTagger ? taggingLinks : links).map((link) => (
          <NavLink key={link.href} {...link} layoutIdPrefix="home" />
        ))}
        {isInternalUser &&
          internalLinks.map((link) => (
            <NavLink key={link.href} {...link} layoutIdPrefix="home" />
          ))}

        {/* {isRemixesEnabled ? (
          <NavLink
            label="Remixes"
            href="/remixes"
            layoutIdPrefix="home"
            icon={<BoxSparkle size={20} />}
          />
        ) : null} */}
        {/* <NavLink
          label="Hi-Res Workflow"
          href="http://172.25.54.201/assets/rushes"
          layoutIdPrefix="home"
          icon={<CainLink2 size={20} />}
          target="_blank"
        /> */}
      </motion.div>
      {!isUserTagger && showUploadLimitIndicator && <UploadLimitIndicator />}
    </motion.div>
  );
};
