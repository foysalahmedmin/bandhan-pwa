import { useClickOutside } from "@/hooks/ui/useClickOutside";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import {
  Children,
  isValidElement,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { FormControl } from "./FormControl";

const extractTextFromJSX = (jsx) => {
  if (typeof jsx === "string") return jsx;
  if (typeof jsx === "number") return jsx?.toString();
  if (isValidElement(jsx)) {
    return Children?.map(jsx.props.children, extractTextFromJSX)
      .filter(Boolean)
      .join(" ");
  }
  return "";
};

const Select = ({
  className,
  classNamePrefix,
  options = [],
  value: valueProp,
  setValue: setValueProp,
  onChange,
  defaultValue,
  disabled = false,
  isLoading = false,
  isRtl = false,
  isClearable = true,
  placeholder = "Select Options",
  ref,
  ...props
}) => {
  const selectRef = useRef(null);
  const [value, setValue] = useState(valueProp);
  const [searchValue, setSearchValue] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => selectRef.current);
  useClickOutside(selectRef, () => setIsOpen(false));

  const filteredOptions =
    options?.length > 0
      ? options?.filter((option) => {
          const label =
            typeof option?.label === "string"
              ? option?.label
              : extractTextFromJSX(option.label);

          return label?.toLowerCase()?.includes(searchValue.toLowerCase());
        })
      : [];

  const onSelect = (value) => {
    setValue(value);
    if (onChange) {
      onChange(value);
    }
    if (setValueProp) {
      setValueProp(value);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    if (valueProp) {
      setValue(valueProp);
    }
  }, [valueProp]);

  return (
    <>
      <FormControl
        ref={selectRef}
        as="div"
        className={cn(
          "form-control form-control-variant-default relative h-auto min-h-form-control overflow-visible",
          className,
        )}
        {...props}
      >
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex size-full items-center justify-between gap-2 py-1"
        >
          <div>{value?.label || placeholder}</div>
          <ChevronRight
            className={cn("text-6 transition-all duration-300", {
              "-rotate-90": isOpen,
              "rotate-90": !isOpen,
            })}
          />
        </div>
        {isOpen && (
          <div className="absolute bottom-0 left-0 right-0 z-20 flex max-h-60 translate-y-full flex-col bg-card">
            <div className="p-1">
              <input
                onChange={(e) => setSearchValue(e.target?.value)}
                className="form-control z-0 h-form-control-sm w-full animate-none border-border"
                type="search"
                placeholder="Search..."
              />
            </div>
            <div className="grow overflow-y-auto p-1">
              <ul className="w-full">
                {filteredOptions?.map((option, index) => (
                  <li
                    className="cursor-pointer px-form-control py-1 text-sm hover:bg-title/5"
                    key={index}
                    onClick={() => onSelect(option)}
                  >
                    {option?.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </FormControl>
    </>
  );
};

export default Select;
