"use client";

import type { User } from "@/api-integration/types/auth";
import type { DataFunc, OnChangeHandlerFunc } from "react-mentions";

import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useCallback,
  useMemo,
  useTransition,
} from "react";

// import { usePathname } from 'next/navigation';

import { useLocation } from "react-router-dom";

import { cn } from "@nextui-org/react";
import { Mention, MentionsInput } from "react-mentions";

import TagSuggestion from "@/components/ui/mentions/TagSuggestion";
import UserSuggestion from "@/components/ui/mentions/UserSuggestion";

import { Tag } from "@/api-integration/types/review";

// import { TESSACT_AI_USER } from '@/utils/reviewUtils';

import disabledClassNames from "./mentions.disabled.module.css";
import classNames from "./mentions.module.css";

export const mentionInputProps = {
  appendSpaceOnAdd: true,
  className:
    "relative z-10 m-0 p-0 border-none outline-none text-ds-comment-input-text-action text-shadow-mention pointer-events-none",
};

export const hashtagRegex = /#[\w]+/gi;

export const getUserMentionDisplay = (
  display_name?: string,
  first_name?: string,
  last_name?: string,
  email?: string
) => {
  return `@${
    display_name ??
    first_name?.concat(" ", last_name ?? "") ??
    email ??
    "Unknown User"
  }`;
};

export const userMentionMarkup = "@<__id__>";
export const tagMentionMarkup = "#<__id__>";

export interface MentionItem {
  display: string;
  id: string;
}

export interface MentionData {
  users: MentionItem[];
  tags: MentionItem[];
}

export interface MentionsInputProps {
  inputRef?:
    | React.Ref<HTMLTextAreaElement>
    | React.Ref<HTMLInputElement>
    | undefined;
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  setMentionData?: Dispatch<SetStateAction<MentionData>>;
  disabled?: boolean;
  autoFocus?: boolean;
  handleKeyDown?: (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  onPlainTextChange?: (text: string) => void;
  placeholder?: string;
  users: User[];
  hashtags: Tag[];
  handleOnFocus?: () => void;
  handleClick?: () => void;
}
export const Mentions = ({
  inputRef,
  text,
  setText,
  setMentionData,
  disabled,
  autoFocus,
  handleKeyDown,
  onPlainTextChange,
  placeholder,
  users,
  hashtags,
  handleOnFocus,
  handleClick,
}: MentionsInputProps) => {
  const [, startTransition] = useTransition();

  const location = useLocation();
  const onEditorPage = location.pathname.includes("/video");

  const allUsers = useMemo(() => {
    if (onEditorPage) {
      // return [TESSACT_AI_USER, ...users];
      return [...users];
    }
    return users;
  }, [users, onEditorPage]);

  const filterUsers: DataFunc = useCallback(
    (query) => {
      return allUsers
        .filter(
          (user) =>
            user.profile.display_name
              ?.toLowerCase()
              .includes(query.toLowerCase()) ||
            user.email?.toLowerCase().includes(query.toLowerCase()) ||
            user.profile.first_name
              ?.toLowerCase()
              .includes(query.toLowerCase()) ||
            user.profile.last_name?.toLowerCase().includes(query.toLowerCase())
        )
        .map((user) => ({
          ...user,
          display: getUserMentionDisplay(
            user.profile.display_name,
            user.profile.first_name,
            user.profile.last_name,
            user.email
          ),
          group: "users",
        }));
    },
    [users]
  );

  const tags = useMemo(() => {
    return hashtags?.map((tag) => ({
      ...tag,
      id: tag.name,
      display: tag.name,
      group: "tags",
    }));
  }, [hashtags]);

  const filterTags: DataFunc = useCallback(
    (query) => {
      return (
        tags?.filter((tag) =>
          tag.display.toLowerCase().startsWith(query.toLowerCase())
        ) ?? []
      );
    },
    [tags]
  );

  const handleInputChange: OnChangeHandlerFunc = useCallback(
    (event, _, newPlainTextValue, mentions) => {
      const value = event.target.value;

      setText(value);
      onPlainTextChange?.(newPlainTextValue);
      setMentionData?.({
        users: mentions.filter((mention) => mention.display.startsWith("@")),
        tags: mentions.filter((mention) => mention.display.startsWith("#")),
      });

      startTransition(() => {
        const matches = value.match(hashtagRegex);
        if (matches && matches.length > 0) {
          setMentionData?.((prevMentionData) => ({
            users: prevMentionData.users,
            tags: prevMentionData.tags.concat(
              matches
                .filter((match) => !tags?.find((tag) => tag.display === match))
                .map((match) => ({
                  display: match.slice(1),
                  id: match.slice(1),
                  group: "tags",
                }))
            ),
          }));
        }
      });
    },
    [setText, setMentionData, onPlainTextChange, tags]
  );

  return (
    <div className="w-full flex-1">
      {/* @ts-ignore */}
      <MentionsInput
        onClick={handleClick}
        onFocus={handleOnFocus}
        suggestionsPortalHost={document.body}
        spellCheck={false}
        value={text}
        inputRef={inputRef}
        singleLine={false}
        allowSuggestionsAboveCursor={true}
        placeholder={placeholder}
        onChange={handleInputChange}
        className="mentions"
        classNames={disabled ? disabledClassNames : classNames}
        disabled={disabled}
        allowSpaceInQuery
        customSuggestionsContainer={(children) => {
          const ul = children as ReactElement;
          const suggestions = ul.props.children as ReactElement[];
          const group = suggestions[0].props.suggestion.group;
          return (
            <ul
              className={cn(
                "flex max-h-96 min-w-56 overflow-auto  rounded-2xl bg-ds-menu-bg p-2  ",
                group === "users" && "flex-col gap-1",
                group === "tags" && "flex-wrap gap-1.5"
              )}
            >
              {suggestions}
            </ul>
          );
        }}
        onKeyDown={handleKeyDown}
        autoFocus={autoFocus}
      >
        {/* @ts-ignore */}
        <Mention
          key="users"
          markup="@<__id__>"
          displayTransform={(id) => {
            const user = allUsers.find((user) => user.id === id);
            return getUserMentionDisplay(
              user?.profile.display_name,
              user?.profile.first_name,
              user?.profile.last_name,
              user?.email
            );
          }}
          {...mentionInputProps}
          trigger="@"
          data={filterUsers}
          renderSuggestion={(
            suggestion,
            search,
            highlightedDisplay,
            index,
            focused
          ) => (
            <UserSuggestion userData={suggestion as User} isActive={focused} />
          )}
        />
        {/* @ts-ignore */}
        <Mention
          key="tags"
          markup="#<__id__>"
          displayTransform={(id) => `#${id}`}
          {...mentionInputProps}
          trigger="#"
          data={filterTags}
          renderSuggestion={(
            suggestion,
            search,
            highlightedDisplay,
            index,
            focused
          ) => (
            <TagSuggestion
              tag={{
                id: suggestion.display ?? "",
                name: suggestion.display ?? "",
              }}
              focused={focused}
            />
          )}
        />
      </MentionsInput>
    </div>
  );
};

Mentions.displayName = "Mentions";
