import React, { useMemo, useRef } from "react";

import { useElementSize } from "@mantine/hooks";
import { motion } from "framer-motion";
import InfiniteScroll from "react-infinite-scroller";

import { ScrollShadow } from "../ui/ScrollShadow";

import { SidebarFilePill } from "./SidebarFilePill";
// import { SidebarFilePill } from "../library/";
import { TreeNode } from "../library/TreeNode";
// import { transition } from "../layout/Sidebar";

import {
  useAIViewContentsQuery,
  useTreeQuery,
  useViewQuery,
} from "../../api-integration/queries/library";

export const LibrarySidebar = () => {
  const isAIView = window.location.href.includes("isAIView");
  const viewId = isAIView ? window.location.href.split("?isAIView=")[1] : null;
  const { data, isLoading, fetchNextPage, hasNextPage } = useTreeQuery(null);

  const scrollParentRef = useRef(null);

  const allNodes = useMemo(() => {
    return data?.pages.flatMap((page) => page.results) || [];
  }, [data]);

  const { data: customView } = useViewQuery(viewId as string);

  const {
    data: aiViewData,
    isLoading: isAiViewLoading,
    fetchNextPage: fetchNextAiViewPage,
    hasNextPage: hasNextAiViewPage,
  } = useAIViewContentsQuery(customView?.ai_search_query || null);

  const allResults = useMemo(() => {
    return aiViewData?.pages.flatMap((page) => page.results) || [];
  }, [aiViewData]);

  const { ref, width } = useElementSize();

  return (
    <motion.div
      className="flex min-h-0 flex-col gap-3"
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%", position: "absolute" }}
      // transition={transition}
    >
      <p className="pl-3 text-sm text-ds-text-secondary">
        {!isAIView ? "Library" : customView?.name}
      </p>
      {!isAIView &&
        (isLoading ? (
          <></>
        ) : (
          <div className="flex min-h-0 flex-col" ref={ref}>
            <ScrollShadow
              className="min-h-0 overflow-x-hidden pr-2"
              ref={scrollParentRef}
              scrollRestorationKey="library-sidebar"
            >
              {/* Assert type to any to resolve TS error */}
              {React.createElement(
                InfiniteScroll as any,
                {
                  hasMore: hasNextPage,
                  loadMore: () => fetchNextPage(),
                  useWindow: false,
                  getScrollParent: () => scrollParentRef.current,
                  about: "",
                },
                <div className="pb-8">
                  {allNodes.map((node) => {
                    if (node.resourcetype === "VersionStack") {
                      if (node?.versions?.length === 0) return null;
                      const file = node?.versions?.[0]?.file;
                      return (
                        <TreeNode
                          key={node.id}
                          nodeId={node.id}
                          name={file.name}
                          resourcetype={file.resourcetype}
                          maxWidth={width - 70}
                          isOnRoot
                          parent={node.parent}
                        />
                      );
                    }
                    return (
                      <TreeNode
                        key={node.id}
                        nodeId={node.id}
                        name={node.name}
                        resourcetype={node.resourcetype}
                        maxWidth={width - 70}
                        isOnRoot
                        childrenCount={node.children_count}
                        parent={node.parent}
                        fileExtension={node.file_extension}
                      />
                    );
                  })}
                </div>
              )}
            </ScrollShadow>
          </div>
        ))}
      {isAIView &&
        (isAiViewLoading ? (
          <></>
        ) : (
          <div ref={ref}>
            <ScrollShadow
              className=" overflow-x-hidden pr-2"
              ref={scrollParentRef}
              scrollRestorationKey="library-sidebar-ai-view"
            >
              {/* Assert type to any to resolve TS error */}
              {React.createElement(
                InfiniteScroll as any,
                {
                  hasMore: hasNextAiViewPage,
                  loadMore: () => fetchNextAiViewPage(),
                  useWindow: false,
                  ref: scrollParentRef,
                  getScrollParent: () => scrollParentRef.current,
                },
                <div className="pb-8">
                  {allResults?.map((item, i) => {
                    return (
                      <SidebarFilePill
                        key={i}
                        href={`/library/asset/${item.id}/?isAIView=${viewId}`}
                        name={item.name}
                        maxWidth={width - 70}
                        fileId={item.id}
                      />
                    );
                  })}
                </div>
              )}
            </ScrollShadow>
          </div>
        ))}
    </motion.div>
  );
};
