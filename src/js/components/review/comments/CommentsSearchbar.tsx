"use client";

import React, { useEffect, useRef, useState } from "react";

import { useLocation, useSearchParams, useNavigate } from "react-router-dom";

// import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useDebouncedCallback } from "@mantine/hooks";
import { motion } from "framer-motion";

import { Searchbar } from "@/components/Searchbar";

const CommentsSearchbar = () => {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [localSearchState, setLocalSearchState] = useState(
    searchParams?.get("query")?.toString() ?? ""
  );

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSearchParam = useDebouncedCallback((query: string) => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }
    navigate(`${pathname}?${params.toString()}`);
  }, 200);

  const onChange = (query: string) => {
    setLocalSearchState(query);
    handleSearchParam(query);
  };

  return (
    <motion.div
      style={{ overflow: "hidden" }}
      initial={{ height: 0 }}
      animate={{ height: "auto" }}
      transition={{ mass: 1, stiffness: 320, damping: 40, type: "spring" }}
      exit={{ height: 0 }}
      key="comment-searchbar"
    >
      <Searchbar
        // hide search icon since search button has the icon
        startContent={null}
        value={localSearchState}
        onValueChange={onChange}
        size={"md"}
        placeholder="Search through your comments"
        ref={inputRef}
      />
    </motion.div>
  );
};

export default CommentsSearchbar;

export const CommentsSearchbarMobile = () => {
  return (
    <div className="flex w-full flex-col gap-2">
      <CommentsSearchbar />
    </div>
  );
};
