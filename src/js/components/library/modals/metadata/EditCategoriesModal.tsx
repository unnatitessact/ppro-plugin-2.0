'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn, useDisclosure } from '@nextui-org/react';
import { nanoid } from 'nanoid';

import { BulletList, DotGrid2X3, PlusSmall, Table, TrashCan } from '@tessact/icons';

import { Button } from '@/components/ui/Button';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@/components/ui/Dropdown';
import { Input } from '@/components/ui/Input';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/Modal';
import { AlertModal } from '@/components/ui/modal/AlertModal';

import { Searchbar } from '@/components/Searchbar';

import {
  useCreateNewCategoryInstance,
  useDeleteCategoryInstance,
  useEditCategoryInstance,
  useReorderCategoryInstances
} from '@/api-integration/mutations/metadata';
import { BaseMetadataTemplateCategory } from '@/api-integration/types/metadata';

interface EditCategoriesModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  assetName: string;
  assetId: string;
  initialCategories: BaseMetadataTemplateCategory[];
  // onApply: (categories: BaseMetadataTemplateCategory[]) => void;
}

export const EditCategoriesModal = ({
  isOpen,
  onOpenChange,
  assetName,
  initialCategories,
  assetId
}: EditCategoriesModalProps) => {
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<BaseMetadataTemplateCategory[]>(initialCategories);

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const { mutateAsync: createNewCategoryInstance } = useCreateNewCategoryInstance(assetId);
  const { mutateAsync: editCategoryInstance } = useEditCategoryInstance(assetId);
  const { mutateAsync: deleteCategoryInstance } = useDeleteCategoryInstance(assetId);
  const { mutateAsync: reorderCategoryInstances } = useReorderCategoryInstances(assetId);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const applyTemplate = async () => {
    setIsLoading(true);

    try {
      const updatedCategories = [...categories];

      // Create new categories and update existing ones
      await Promise.all(
        updatedCategories.map(async (category, index) => {
          const foundCategory = initialCategories.find((c) => c.id === category.id);

          // If a category exists in new list and not in initial list, create it
          if (!foundCategory) {
            const data = await createNewCategoryInstance({
              name: category.name,
              isTable: category.is_table
            });
            updatedCategories[index] = { ...category, id: data.id };
          }

          // If a category exists in initial list and new list and name has changed, update it
          if (foundCategory && foundCategory.name !== category.name) {
            await editCategoryInstance({ categoryId: category.id, name: category.name });
          }
        })
      );

      // Delete removed categories
      await Promise.all(
        initialCategories.map(async (category) => {
          const isDeleted = !updatedCategories.some(
            (newCategory) => newCategory.id === category.id
          );
          if (isDeleted) {
            await deleteCategoryInstance(category.id);
          }
        })
      );

      // Update the state with the new IDs
      setCategories(updatedCategories);

      // Reorder categories with updated IDs
      await reorderCategoryInstances(updatedCategories.map((category) => category.id));
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
    onOpenChange(false);
  };

  const handleAction = (value: string) => {
    if (value === 'field') {
      setCategories((categories) => [
        ...categories,
        { id: nanoid(), name: 'New category', is_table: false }
      ]);
    }
    if (value === 'table') {
      setCategories((categories) => [
        ...categories,
        { id: nanoid(), name: 'New table', is_table: true }
      ]);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader
          subheading="Edit Categories for"
          title={assetName}
          description="Categories help organize different kinds of metadata"
        />
        <ModalBody className="min-h-80">
          <div className="flex justify-between gap-6">
            <Searchbar placeholder="Search categories" value={search} onValueChange={setSearch} />
            <Dropdown className="max-w-60">
              <DropdownTrigger>
                <Button isIconOnly color="secondary" size="lg" aria-label="Add category">
                  <PlusSmall size={20} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu onAction={(value) => handleAction(value as string)}>
                <DropdownItem
                  key="field"
                  description="Single-value fields allow you to capture a single value for each metadata field"
                >
                  <div className="flex items-center gap-2">
                    <BulletList size={24} />
                    <span>Single-value fields</span>
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="table"
                  description="A multi-value table allows you to capture multiple rows of related values for an asset."
                >
                  <div className="flex items-center gap-2">
                    <Table size={24} />
                    <span>Multi-value table</span>
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="flex flex-col gap-1">
            <p className="px-3 py-2 text-sm text-ds-text-secondary">Categories</p>
            <div className="flex flex-col">
              <DndContext
                sensors={sensors}
                onDragEnd={(event) => {
                  const { active, over } = event;

                  if (active.id !== over?.id) {
                    const oldIndex = categories.findIndex((t) => t.id === active.id);
                    const newIndex = categories.findIndex((t) => t.id === over?.id);
                    const newTemplate = arrayMove(categories, oldIndex, newIndex);
                    setCategories(newTemplate);
                  }
                }}
              >
                <SortableContext items={categories.map((category) => category.id)}>
                  {categories
                    .filter((category) =>
                      category.name.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((category) => (
                      <CategoryItem
                        key={category.id}
                        category={category}
                        setCategories={setCategories}
                        isDraggable={search === ''}
                      />
                    ))}
                </SortableContext>
              </DndContext>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onPress={() => onOpenChange(false)} aria-label="Cancel">
            Cancel
          </Button>
          <Button color="primary" onPress={applyTemplate} isLoading={isLoading} aria-label="Apply">
            Apply
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const CategoryItem = ({
  category,
  setCategories,
  isDraggable
}: {
  category: BaseMetadataTemplateCategory;
  setCategories: Dispatch<SetStateAction<BaseMetadataTemplateCategory[]>>;
  isDraggable: boolean;
}) => {
  const [label, setLabel] = useState(category.name);

  const {
    isOpen: isDeleteCategoryOpen,
    onOpen: openDeleteCategory,
    onOpenChange: onDeleteCategoryOpenChange
  } = useDisclosure();

  useEffect(() => {
    setCategories((categories) =>
      categories.map((t) => (t.id === category.id ? { ...t, name: label } : t))
    );
  }, [label, category.id, setCategories]);

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: category.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className="flex items-center justify-between py-2"
      >
        <div className="flex items-center gap-2">
          <DotGrid2X3
            size={20}
            className={cn(
              'text-ds-menu-text-secondary transition-opacity',
              !isDraggable && 'pointer-events-none opacity-0'
            )}
            {...listeners}
          />
          <Input placeholder="Category name" value={label} onValueChange={setLabel} size="lg" />
        </div>
        <Button
          isIconOnly
          color="secondary"
          size="lg"
          onPress={openDeleteCategory}
          aria-label="Delete category"
        >
          <TrashCan size={20} />
        </Button>
      </div>
      <AlertModal
        isOpen={isDeleteCategoryOpen}
        onOpenChange={onDeleteCategoryOpenChange}
        title="Delete Category"
        description="All metadata in the category will also be deleted."
        onConfirm={() => {
          setCategories((categories) => categories.filter((t) => t.id !== category.id));
        }}
        danger
        actionText="Confirm"
      />
    </>
  );
};
