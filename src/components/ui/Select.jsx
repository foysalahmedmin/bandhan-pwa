import { useClickOutside } from "@/hooks/ui/useClickOutside";
import { cn } from "@/lib/utils";
import { AlertCircle, ChevronRight, Loader2, X } from "lucide-react";
import { forwardRef, useEffect, useRef, useState } from "react";
import { FormControl } from "./FormControl";

// Prop validation function
const validateProps = (props) => {
  const errors = [];

  if (props.options && !Array.isArray(props.options)) {
    errors.push("options must be an array");
  }

  if (props.isMulti && props.value && !Array.isArray(props.value)) {
    errors.push("value must be array when isMulti=true");
  }

  if (!props.isMulti && props.value && Array.isArray(props.value)) {
    errors.push("value must not be array when isMulti=false");
  }

  return errors;
};

// Normalize option to { label, value } format
const normalizeOption = (option) => {
  if (option === null || option === undefined) return null;

  if (typeof option === "string" || typeof option === "number") {
    return { label: String(option), value: option };
  }

  return {
    label: option.label ?? String(option.value ?? ""),
    value: option.value ?? option.label ?? "",
    ...option,
  };
};

const normalizeOptions = (options) => {
  return options?.map(normalizeOption).filter(Boolean) || [];
};

const Select = forwardRef(
  (
    {
      className,
      options = [],
      value: valueProp,
      onChange,
      defaultValue,
      disabled = false,
      isLoading = false,
      isClearable = true,
      placeholder = "Select...",
      searchPlaceholder = "Search...",
      isMulti = false,
      isSearchable = true,
      noOptionsMessage = "No options",
      loadingMessage = "Loading...",
      maxMenuHeight = 240,
      menuPosition = "bottom",
      error,
      required = false,
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    // Refs
    const selectRef = useRef(null);
    const searchInputRef = useRef(null);
    const menuRef = useRef(null);

    // State
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [internalValue, setInternalValue] = useState(() => {
      if (valueProp !== undefined) return valueProp;
      if (defaultValue !== undefined) return defaultValue;
      return isMulti ? [] : null;
    });

    // Determine controlled vs uncontrolled
    const isControlled = valueProp !== undefined;
    const value = isControlled ? valueProp : internalValue;

    // Normalize and filter options
    const normalizedOptions = normalizeOptions(options);
    const filteredOptions = normalizedOptions.filter((option) => {
      if (!isSearchable || !searchValue) return true;
      const search = searchValue.toLowerCase();
      return (
        String(option.label).toLowerCase().includes(search) ||
        String(option.value).toLowerCase().includes(search)
      );
    });

    // Close menu on outside click
    useClickOutside(selectRef, () => {
      if (isOpen) {
        setIsOpen(false);
        setSearchValue("");
        setFocusedIndex(-1);
      }
    });

    // Sync internal state with controlled value
    useEffect(() => {
      if (isControlled) {
        setInternalValue(valueProp);
      }
    }, [valueProp, isControlled]);

    // Update value handler
    const updateValue = (newValue) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    };

    // Handle option selection
    const handleSelect = (selectedOption) => {
      if (disabled || !selectedOption) return;

      if (isMulti) {
        const current = Array.isArray(value) ? value : [];
        const exists = current.some(
          (item) => item.value === selectedOption.value,
        );

        const newValue = exists
          ? current.filter((item) => item.value !== selectedOption.value)
          : [...current, selectedOption];

        updateValue(newValue);
      } else {
        updateValue(selectedOption);
        setIsOpen(false);
        setSearchValue("");
      }
    };

    // Remove selected option (multi-select)
    const removeOption = (option, e) => {
      e.stopPropagation();
      if (disabled || !isMulti) return;

      const newValue = Array.isArray(value)
        ? value.filter((item) => item.value !== option.value)
        : [];

      updateValue(newValue);
    };

    // Clear all selections
    const clearSelection = (e) => {
      e.stopPropagation();
      if (disabled || !isClearable) return;
      updateValue(isMulti ? [] : null);
    };

    // Toggle menu visibility
    const toggleMenu = () => {
      if (disabled) return;

      const willOpen = !isOpen;
      setIsOpen(willOpen);

      if (willOpen) {
        setFocusedIndex(-1);
        setTimeout(() => searchInputRef.current?.focus(), 0);
      } else {
        setSearchValue("");
      }
    };

    // Keyboard navigation
    const handleKeyDown = (e) => {
      if (disabled) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (!isOpen) setIsOpen(true);
          else
            setFocusedIndex((i) => Math.min(i + 1, filteredOptions.length - 1));
          break;

        case "ArrowUp":
          e.preventDefault();
          if (isOpen) setFocusedIndex((i) => Math.max(i - 1, 0));
          break;

        case "Enter":
          e.preventDefault();
          if (isOpen && focusedIndex >= 0) {
            handleSelect(filteredOptions[focusedIndex]);
          } else if (!isOpen) {
            toggleMenu();
          }
          break;

        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          break;

        case "Backspace":
          if (isMulti && !searchValue && Array.isArray(value) && value.length) {
            removeOption(value[value.length - 1], e);
          }
          break;
      }
    };

    // Render selected value(s)
    const renderValue = () => {
      if (isMulti && Array.isArray(value) && value.length > 0) {
        return value.map((option) => (
          <div
            key={option.value}
            className="flex items-center gap-1 rounded bg-muted px-2 py-1 text-sm"
          >
            <span>{option.label}</span>
            {!disabled && (
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={(e) => removeOption(option, e)}
                aria-label={`Remove ${option.label}`}
              />
            )}
          </div>
        ));
      }

      if (!isMulti && value) {
        return <span>{value.label}</span>;
      }

      return <span className="text-muted-foreground">{placeholder}</span>;
    };

    // Validate props
    const propErrors = validateProps({ options, value: valueProp, isMulti });
    if (propErrors.length > 0) {
      return (
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>Select Error: {propErrors.join(", ")}</span>
        </div>
      );
    }

    return (
      <FormControl
        as="div"
        ref={selectRef}
        className={cn(
          "relative",
          disabled && "cursor-not-allowed opacity-50",
          error && "border-destructive",
          className,
        )}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-required={required}
        aria-invalid={!!error}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <div
          onClick={toggleMenu}
          className={cn(
            "flex w-full cursor-pointer items-center justify-between gap-2 py-1",
            disabled && "cursor-not-allowed",
          )}
        >
          <div className="flex min-w-0 flex-1 flex-wrap gap-1">
            {renderValue()}
          </div>

          <div className="flex items-center gap-1">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}

            {isClearable && value && !disabled && (
              <X
                className="h-4 w-4 cursor-pointer hover:text-destructive"
                onClick={clearSelection}
                aria-label="Clear selection"
              />
            )}

            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform",
                isOpen ? "rotate-90" : "rotate-0",
              )}
            />
          </div>
        </div>

        {isOpen && (
          <div
            ref={menuRef}
            className={cn(
              "absolute left-0 right-0 z-50 rounded-md border bg-popover shadow-lg",
              menuPosition === "top" ? "bottom-full mb-1" : "top-full mt-1",
            )}
            style={{ maxHeight: maxMenuHeight }}
          >
            {isSearchable && (
              <div className="border-b p-2">
                <input
                  ref={searchInputRef}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full rounded border p-2 text-sm"
                  placeholder={searchPlaceholder}
                  aria-label="Search options"
                />
              </div>
            )}

            <div className="overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center p-4 text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {loadingMessage}
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  {noOptionsMessage}
                </div>
              ) : (
                <ul className="py-1">
                  {filteredOptions.map((option, index) => {
                    const selected = isMulti
                      ? value?.some((v) => v.value === option.value)
                      : value?.value === option.value;

                    return (
                      <li
                        key={option.value}
                        className={cn(
                          "cursor-pointer px-3 py-2 text-sm hover:bg-accent",
                          selected && "bg-accent/50",
                          focusedIndex === index && "bg-accent/30",
                        )}
                        onClick={() => handleSelect(option)}
                        aria-selected={selected}
                      >
                        {option.label}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        )}
      </FormControl>
    );
  },
);

Select.displayName = "Select";

export default Select;
