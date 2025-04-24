// "use client";

// import {
//   //  Key,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";

// import {
//   cn,
//   Spinner,
//   //  useDisclosure
// } from "@nextui-org/react";
// import { motion } from "framer-motion";
// import { nanoid } from "nanoid";
// import { SelectInstance } from "react-select";
// import Select from "react-select/creatable";

// // import { toast } from 'sonner';

// import { Button } from "../../ui/Button";
// // import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@/components/ui/Dropdown';
// // import { AlertModal } from '@/components/ui/modal/AlertModal';
// import { Tab, Tabs } from "../../ui/Tabs";

// import {
//   AttachmentFilterPill,
//   DateFilterPill,
//   FileStatusFilterPill,
//   LocationFilterPill,
//   MultiselectFilterPill,
//   NumberFilterPill,
//   PersonFilterPill,
//   RatingFilterPill,
//   SelectFilterPill,
//   TaggingStatusFilterPill,
//   TextareaFilterPill,
//   TextFilterPill,
//   TimecodeFilterPill,
//   ToggleFilterPill,
// } from "./pills";

// // import { useLibraryFilterState } from "../../../hooks/useLibraryFilterState";
// import { useTagger } from "../../../hooks/useTagger";

// // import { useCreateView } from '@/api-integration/mutations/library';
// import { useGenerateFiltersWithAI } from "../../../api-integration/queries/library";
// import { useMetadataFieldsQuery } from "../../../api-integration/queries/metadata";
// import {
//   FieldOption,
//   MetadataFieldInfo,
//   MetadataFieldType,
// } from "../../../api-integration/types/metadata";

// import { Filter } from "../../../stores/library-store";

// import { getIconFromType } from "../../../utils/metadata";

// const filterPillComponents = {
//   text: TextFilterPill,
//   text_area: TextareaFilterPill,
//   date: DateFilterPill,
//   location: LocationFilterPill,
//   rating: RatingFilterPill,
//   toggle: ToggleFilterPill,
//   attachment: AttachmentFilterPill,
//   person: PersonFilterPill,
//   select: SelectFilterPill,
//   multiselect: MultiselectFilterPill,
//   timecode: TimecodeFilterPill,
//   timecode_range: null,
//   number: NumberFilterPill,
//   file_status: FileStatusFilterPill,
//   tagging_status: TaggingStatusFilterPill,
// };

// const renderFilterPillComponent = (filter: Filter) => {
//   const FilterPillComponent = filterPillComponents[filter.type];
//   return FilterPillComponent ? (
//     <FilterPillComponent key={filter.id} filter={filter} />
//   ) : null;
// };

// const staticFilters: MetadataFieldInfo[] = [
//   { id: "created_on", name: "Created date", field_type: "date", options: [] },
//   { id: "modified_on", name: "Modified date", field_type: "date", options: [] },
//   { id: "created_by", name: "Created by", field_type: "person", options: [] },
//   { id: "name", name: "Name", field_type: "text", options: [] },
//   { id: "file__file_type", name: "File type", field_type: "text", options: [] },
//   {
//     id: "file__file_extension",
//     name: "File extension",
//     field_type: "text",
//     options: [],
//   },
//   {
//     id: "file__videofile__codec",
//     name: "File codec",
//     field_type: "text",
//     options: [],
//   },
//   {
//     id: "file__videofile__alpha_channel",
//     name: "File alpha channel",
//     field_type: "toggle",
//     options: [],
//   },
//   {
//     id: "file__file_status",
//     name: "File status",
//     field_type: "file_status",
//     options: [],
//   },
//   {
//     id: "file__tagging_status",
//     name: "Tagging status",
//     field_type: "tagging_status",
//     options: [],
//   },
// ];

// export const FilterBar = () => {
//   const {
//     clearFilters,
//     addFilter,
//     filters,
//     filterMatchType,
//     setFilterMatchType,
//     removeFilter,
//     sorts,
//     // addS ort,
//     // removeSort,
//     // modifySort,
//     clearSorts,
//   } = useLibraryFilterState();

//   const showFileStatusFilter = true;

//   const { showTagging: showTaggingStatusFilter } = useTagger();

//   // const [saveOption, setSaveOption] = useState<'private' | 'workspace'>('private');
//   const [aiFilterQuery, setAiFilterQuery] = useState("");
//   const [input, setInput] = useState("");

//   const { data: aiFilters, isLoading: isAiFiltersLoading } =
//     useGenerateFiltersWithAI(aiFilterQuery);

//   // const {
//   //   isOpen: isSaveViewOpen,
//   //   onOpenChange: onSaveViewChange,
//   //   onOpen: onSaveViewOpen
//   // } = useDisclosure();

//   const { data: fields, fetchNextPage } = useMetadataFieldsQuery();

//   // const { mutateAsync: createView } = useCreateView();

//   const options = useMemo(() => {
//     let options = [...staticFilters];
//     if (!showFileStatusFilter) {
//       options = options.filter((filter) => filter.field_type !== "file_status");
//     }
//     if (!showTaggingStatusFilter) {
//       options = options.filter(
//         (filter) => filter.field_type !== "tagging_status"
//       );
//     }
//     if (fields) {
//       options = [...options, ...fields.pages.flatMap((page) => page.results)];
//     }
//     return options.filter((option) => option.field_type !== "timecode_range");
//   }, [fields, showFileStatusFilter, showTaggingStatusFilter]);

//   useEffect(() => {
//     // ?NOTE: Doing this instead of hasNextPage because it would stop fetching after the second page for some reason
//     if (fields && fields.pages.at(-1)?.meta.next) {
//       fetchNextPage();
//     }
//   }, [fetchNextPage, fields]);

//   useEffect(() => {
//     if (aiFilters && aiFilters.length > 0) {
//       aiFilters.forEach((filter) => {
//         if (filter.meta_field_name) {
//           addFilter({
//             id: nanoid(),
//             label: filter.meta_field_name,
//             type: filter.field_type,
//             value: filter.value,
//             operator: filter.operator,
//             options: filter.options,
//           });
//         } else {
//           if (filter.static_field_name === "file__file_status") {
//             addFilter({
//               id: nanoid(),
//               label:
//                 staticFilters.find((f) => f.id === filter.static_field_name)
//                   ?.name || "",
//               type: "file_status",
//               value: filter.value,
//               operator: filter.operator,
//               isStatic: true,
//               key: filter.static_field_name,
//               options: filter.options,
//             });
//           } else if (filter.static_field_name === "file__tagging_status") {
//             addFilter({
//               id: nanoid(),
//               label:
//                 staticFilters.find((f) => f.id === filter.static_field_name)
//                   ?.name || "",
//               type: "tagging_status",
//               value: filter.value,
//               operator: filter.operator,
//               isStatic: true,
//               key: filter.static_field_name,
//               options: filter.options,
//             });
//           } else {
//             addFilter({
//               id: nanoid(),
//               label:
//                 staticFilters.find((f) => f.id === filter.static_field_name)
//                   ?.name || "",
//               type: filter.field_type,
//               value: filter.value,
//               operator: filter.operator,
//               isStatic: true,
//               key: filter.static_field_name,
//               options: filter.options,
//             });
//           }
//         }
//       });
//     }
//   }, [aiFilters, addFilter]);

//   const inputRef = useRef<
//     SelectInstance<{
//       label: string;
//       value: string;
//       type: MetadataFieldType;
//       opts: FieldOption[];
//     } | null>
//   >(null);

//   // const handleAction = (key: Key) => {
//   //   if (key === 'save-privately') {
//   //     setSaveOption('private');
//   //   }
//   //   if (key === 'save-to-workspace') {
//   //     setSaveOption('workspace');
//   //   }
//   //   onSaveViewOpen();
//   // };

//   return (
//     <>
//       <motion.div
//         layout="position"
//         initial={{ y: -10, opacity: 0 }}
//         animate={{
//           y: 0,
//           opacity: 1,
//           transition: { duration: 0.2, delay: 0.1, ease: "easeOut" },
//         }}
//         exit={{
//           y: -10,
//           opacity: 0,
//           transition: { duration: 0.2, ease: "easeOut" },
//         }}
//         onAnimationComplete={() => {
//           inputRef.current?.focus();
//         }}
//         className="pr-6"
//       >
//         <div
//           className={cn(
//             "flex items-center justify-between gap-2",
//             "rounded-2xl bg-ds-filter-bar-bg",
//             "py-1.5 pl-4 pr-2"
//           )}
//         >
//           <div className="flex flex-1 cursor-text items-center gap-3">
//             <p className="text-sm font-medium text-ds-filter-bar-label">
//               Filter by
//             </p>
//             <div className="flex flex-1 flex-wrap items-center gap-x-2 gap-y-0.5">
//               {filters.map((filter) => renderFilterPillComponent(filter))}
//               {isAiFiltersLoading && <Spinner size="sm" />}
//               <Select
//                 menuPortalTarget={document.body}
//                 onKeyDown={(e) => {
//                   if (
//                     e.key === "Backspace" &&
//                     input.length === 0 &&
//                     filters.length > 0
//                   ) {
//                     const lastFilter = filters[filters.length - 1];
//                     if (lastFilter) {
//                       removeFilter(lastFilter.id);
//                     }
//                   }
//                 }}
//                 unstyled
//                 placeholder=""
//                 controlShouldRenderValue={false}
//                 options={options.map((option) => ({
//                   label: option.name,
//                   value: option.id,
//                   type: option.field_type,
//                   opts: option.options,
//                 }))}
//                 inputValue={input}
//                 openMenuOnFocus
//                 onInputChange={(value) => setInput(value)}
//                 noOptionsMessage={() => <></>}
//                 ref={inputRef}
//                 classNames={{
//                   dropdownIndicator: () => "!hidden",
//                   input: () => "min-w-60",
//                   menuPortal: () => "!z-50",
//                   menu: () =>
//                     "p-0 bg-ds-menu-bg border-ds-menu-border border rounded-xl !z-[100]",
//                   menuList: () => "bg-ds-menu-bg p-2 rounded-xl space-y-1",
//                   option: ({ isFocused }) =>
//                     `py-1.5 px-2 !cursor-pointer !font-karla !font-medium rounded-lg !text-sm ${
//                       isFocused ? "bg-ds-menu-bg-hover" : ""
//                     }`,
//                   placeholder: () => "text-sm text-ds-input-placeholder",
//                   valueContainer: () => "text-sm",
//                 }}
//                 onCreateOption={(input) => {
//                   setAiFilterQuery(input);
//                 }}
//                 formatCreateLabel={(input) => `Filter with AI for "${input}"`}
//                 formatOptionLabel={(data) => {
//                   return (
//                     <div className="flex items-center gap-1">
//                       {data?.type && getIconFromType(data.type, 20)}
//                       <span>{data?.label}</span>
//                     </div>
//                   );
//                 }}
//                 onChange={(data) => {
//                   if (data) {
//                     const isStaticFilter = staticFilters.some(
//                       (filter) => filter.id === data?.value
//                     );

//                     if (isStaticFilter) {
//                       addFilter({
//                         id: nanoid(),
//                         label: data.label || "",
//                         type: data.type || "text",
//                         value:
//                           data.type === "toggle" || data.type === "attachment"
//                             ? "true"
//                             : null,
//                         operator: null,
//                         isStatic: true,
//                         key: data.value,
//                         options: [],
//                       });
//                       return;
//                     }

//                     addFilter({
//                       id: nanoid(),
//                       label: data.label || "",
//                       type: data.type || "text",
//                       value:
//                         data.type === "toggle" || data.type === "attachment"
//                           ? "true"
//                           : null,
//                       operator: null,
//                       options: data.opts,
//                     });
//                   }
//                 }}
//                 createOptionPosition="first"
//               />
//             </div>
//           </div>
//           <div className="flex items-center gap-4">
//             <Tabs
//               aria-label="Apply filters for"
//               classNames={{ tabList: "h-9" }}
//               selectedKey={filterMatchType}
//               onSelectionChange={(key) =>
//                 setFilterMatchType(key as "all" | "any")
//               }
//             >
//               <Tab key="all" title="All"></Tab>
//               <Tab key="any" title="Any"></Tab>
//             </Tabs>
//             {(filters.length > 0 || sorts.length > 0) && (
//               <>
//                 <div className="flex items-center space-x-2">
//                   <Button
//                     color="secondary"
//                     size="sm"
//                     onPress={() => {
//                       clearFilters();
//                       clearSorts();
//                     }}
//                     aria-label="Clear filters"
//                   >
//                     Clear
//                   </Button>
//                   {/* <Dropdown placement="bottom-end">
//                     <DropdownTrigger>
//                       <Button color="default" size="sm">
//                         Save
//                       </Button>
//                     </DropdownTrigger>
//                     <DropdownMenu onAction={handleAction}>
//                       <DropdownItem key="save-privately">Save privately</DropdownItem>
//                       <DropdownItem key="save-to-workspace">Save to Workspace</DropdownItem>
//                     </DropdownMenu>
//                   </Dropdown> */}
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </motion.div>
//       {/* <AlertModal
//         isOpen={isSaveViewOpen}
//         onOpenChange={onSaveViewChange}
//         title="Save view"
//         description={
//           saveOption === 'private'
//             ? 'Visible only to you'
//             : saveOption === 'workspace'
//               ? 'Visible to everyone in this workspace'
//               : ''
//         }
//         hasInput
//         inputPlaceholder="View name"
//         onConfirm={async (name) => {
//           await createView(
//             {
//               name,
//               visible_to_all: saveOption === 'workspace',
//               filter_match_type: filterMatchType,
//               filters: filters
//             },
//             {
//               onSuccess: () => {
//                 toast.success('View created', {
//                   description: 'You can now access this view from the views list'
//                 });
//               }
//             }
//           );
//         }}
//       /> */}
//     </>
//   );
// };
