import { useState } from "react";
import { type ITag } from "@/hooks/useTagInput";

export const useProfileTags = (
  tags: ITag[],
  onChangeTags: (tags: ITag[]) => void
) => {
  const [CheckTags, setCheckTags] = useState<ITag[]>(tags);

  const handleRemoveTag = (tagId: string) => {
    const updatedTags = tags.filter((tag) => tag.id !== tagId);
    onChangeTags(updatedTags);
  };
  const handleChange = (value: boolean, tagC: ITag) => {
    if (!value) {
      const updatedTags = CheckTags.filter((tag) => tag.id !== tagC.id);
      setCheckTags(updatedTags);
    } else {
      const updatedTags = [...CheckTags, tagC];
      setCheckTags(updatedTags);
    }
  };

  const nameTagLimitedCharacters = (name: string) => {
    if (name === undefined || name === null || typeof name !== "string") {
      return "";
    }
    if (name.length > 50) {
      return name.substring(0, 45) + " ...";
    }
    return name;
  };

  return {
    handleRemoveTag,
    handleChange,
    CheckTags,
    nameTagLimitedCharacters,
  };
};
