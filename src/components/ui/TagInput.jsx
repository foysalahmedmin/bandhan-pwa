import useLanguageState from "@/hooks/state/useLanguageState";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FormControl } from "./FormControl";

const TagInput = ({
  className,
  inputClassName,
  setInputs: setInputsProp,
  inputs: inputsProp,
}) => {
  const { isEnglish } = useLanguageState();

  // State management
  const [inputs, setInputs] = useState(inputsProp || []);
  const [input, setInput] = useState("");

  // Handle adding a new tag
  const handleAddTag = () => {
    if (input) {
      const updatedInputs = [...inputs, input];
      setInputs(updatedInputs);
      if (setInputsProp) {
        setInputsProp(updatedInputs);
      }
      setInput("");
    }
  };

  // Handle removing a tag
  const handleRemoveTag = (indexToRemove) => {
    const updatedInputs = inputs.filter((_, index) => index !== indexToRemove);
    setInputs(updatedInputs);
    if (setInputsProp) {
      setInputsProp(updatedInputs);
    }
  };

  // Sync inputs prop with internal state
  useEffect(() => {
    if (inputsProp?.length) {
      setInputs(inputsProp);
    }
  }, [inputsProp]);

  return (
    <div className={cn("space-y-2", className)}>
      {/* Tag input field */}
      <FormControl
        className={cn("", inputClassName)}
        value={input}
        type="tel"
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
        placeholder="Enter consumer numbers"
      />

      {/* Instructions for adding tags */}
      <div className="mt-2 flex items-center">
        <p className="text-xs font-semibold text-primary">
          {isEnglish
            ? "Please press "
            : "অনুগ্রহ করে আরও কনসিউমার নম্বর যোগ করতে কীবোর্ডে "}
          <Check className="inline size-4" strokeWidth={5} />
          {isEnglish ? "on keyboard to add more consumer number" : "প্রেস করুন"}
        </p>
      </div>

      {/* Render tags */}
      <div className="flex flex-wrap items-center">
        {inputs.map((item, index) => (
          <span
            className="flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-xs leading-none text-primary-foreground"
            key={index}
          >
            <span className="leading-none">{item}</span>
            <X
              onClick={() => handleRemoveTag(index)}
              className="size-4 cursor-pointer"
            />
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
