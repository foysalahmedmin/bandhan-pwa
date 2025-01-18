import useLanguageState from "@/hooks/state/useLanguageState";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FormControl } from "./FormControl";

const TagInput = ({
  classNameName,
  inputClassName,
  setInputs: setInputsProp,
  inputs: inputsProp,
}) => {
  const { isEnglish } = useLanguageState();

  const [inputs, setInputs] = useState([]);
  const [input, setInput] = useState("");

  const handleAddTag = () => {
    if (input) {
      setInputs([...inputs, input]);
      if (setInputsProp) {
        setInputsProp([...inputsProp, input]);
      }
      setInput("");
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    setInputs(inputs.filter((_, index) => index !== indexToRemove));
    if (setInputsProp) {
      if (inputsProp) {
        setInputsProp(inputsProp.filter((_, index) => index !== indexToRemove));
      } else {
        setInputsProp(inputs.filter((_, index) => index !== indexToRemove));
      }
    }
  };

  useEffect(() => {
    if (inputsProp?.length) {
      setInputs(inputsProp);
    }
  }, [inputsProp]);

  return (
    <div className={cn("space-y-2", classNameName)}>
      <FormControl
        className={cn("", inputClassName)}
        value={input}
        type="tel"
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
        placeholder="Enter consumer numbers"
      />
      <div className="mt-2 flex items-center">
        <p className="text-primary">
          {isEnglish
            ? "Please press "
            : "অনুগ্রহ করে আরও কনসিউমার নম্বর যোগ করতে কীবোর্ডে "}
          <Check className="inline size-3" />
          {isEnglish ? "on keyboard to add more consumer number" : "প্রেস করুন"}
        </p>
      </div>
      <div>
        {inputs?.map((item, index) => (
          <span
            className="flex gap-1 rounded-full bg-primary p-1 text-xs leading-none text-primary-foreground"
            key={index}
          >
            <span>{item}</span>
            <X onClick={handleRemoveTag(item)} className="size-4" />
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
