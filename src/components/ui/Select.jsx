import { useClickOutside } from "@/hooks/ui/useClickOutside";
import { cn } from "@/lib/utils";
import { ChevronRight, X } from "lucide-react";
import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { FormControl } from "./FormControl";

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
  isMulti = false,
  ref,
  ...props
}) => {
  const selectRef = useRef(null);
  const [value, setValue] = useState(isMulti ? [] : null);
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => selectRef.current);
  useClickOutside(selectRef, () => setIsOpen(false));

  const filteredOptions =
    options?.length > 0
      ? options?.filter((option) => {
          const label =
            typeof option?.label === "string" ? option?.label : option?.value;

          return label?.toLowerCase()?.includes(searchValue.toLowerCase());
        })
      : [];

  const onSelect = (selectedOption) => {
    if (isMulti) {
      const newValue = value.includes(selectedOption)
        ? value.filter((opt) => opt !== selectedOption)
        : [...value, selectedOption];
      setValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
      if (setValueProp) {
        setValueProp(newValue);
      }
    } else {
      setValue(selectedOption);
      if (onChange) {
        onChange(selectedOption);
      }
      if (setValueProp) {
        setValueProp(selectedOption);
      }
      setIsOpen(false);
    }
  };

  const removeOption = (optionToRemove) => {
    const newValue = value.filter((opt) => opt !== optionToRemove);
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
    if (setValueProp) {
      setValueProp(newValue);
    }
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
          <div className="flex flex-wrap gap-1">
            {isMulti && value?.length > 0 ? (
              value.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 rounded bg-title/10 px-2 py-1 text-sm"
                >
                  <span>{option.label}</span>
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeOption(option);
                    }}
                  />
                </div>
              ))
            ) : (
              <span>
                {!isMulti ? value?.label || placeholder : placeholder}
              </span>
            )}
          </div>
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
                    className={cn(
                      "cursor-pointer px-form-control py-1 text-sm hover:bg-title/5",
                      {
                        "bg-title/10": isMulti
                          ? value.includes(option)
                          : value === option,
                      },
                    )}
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
