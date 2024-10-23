import { useState } from "react";

export interface ITag {
  id: string;
  tagName: string;
}

export const useTagInput = (
  tags: ITag[],
  onChangeTags: (tags: ITag[]) => void,
  onChangeValue: (value: string) => void
) => {
  const [focus, setFocus] = useState<boolean>(false);
  const [editDisabled, setEditDisabled] = useState<boolean>(false);

  const handleAddTag = (value: string) => {
    // validate if tag already exists
    const tagExist = tags.find((tag) => tag.id === value);
    if (tagExist != null) return;
    if (value === "") return;

    const tag: ITag = {
      id: value,
      tagName: value,
    };
    const updatedTags = [...tags, tag];
    onChangeTags(updatedTags);
  };

  const handleFieldChange = (value: string) => {
    if (value.endsWith(",") && value.length > 1) {
      const tag = value.slice(0, -1);
      handleAddTag(tag);
      onChangeValue("");
    } else {
      onChangeValue(value);
    }
  };

  const handleEnter = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tag = e.target.value;
      handleAddTag(tag);
      onChangeValue("");
    }
  };

  const handleEditDisabled = () => {
    setEditDisabled(!editDisabled);
  };

  return {
    focus,
    setFocus,
    handleAddTag,
    handleFieldChange,
    handleEnter,

    editDisabled,
    handleEditDisabled,
  };
};
