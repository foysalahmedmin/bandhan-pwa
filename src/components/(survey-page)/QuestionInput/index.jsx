import { Checkbox } from "@/components/ui/Checkbox";
import { FormControl } from "@/components/ui/FormControl";
import { Radio } from "@/components/ui/Radio";
import { formatDateForInput } from "@/utils/surveyUtils";
import React from "react";

const RangeInput = React.memo(
  ({ question, value, onChange, isRequired, isEnglish, prefix }) => {
    const handleChange = (val, isStart) => {
      const current = Array.isArray(value) ? [...value] : ["", ""];
      current[isStart ? 0 : 1] = val;
      onChange(current);
    };

    const startPlaceholder = isEnglish ? "Start value" : "শুরুর মান";
    const endPlaceholder = isEnglish ? "End value" : "শেষ মান";
    const separatorText = isEnglish ? "to" : "থেকে";

    const renderRangeInput = () => {
      switch (question.input_type) {
        case "number-range":
          return (
            <div className="flex items-center gap-2">
              <FormControl
                name={`${prefix}-start`}
                type="number"
                value={Array.isArray(value) ? value[0] || "" : ""}
                onChange={(e) => handleChange(e.target.value, true)}
                step={question?.step || "any"}
                required={isRequired}
                placeholder={startPlaceholder}
              />
              <span className="text-gray-500">{separatorText}</span>
              <FormControl
                name={`${prefix}-end`}
                type="number"
                value={Array.isArray(value) ? value[1] || "" : ""}
                onChange={(e) => handleChange(e.target.value, false)}
                step={question?.step || "any"}
                required={isRequired}
                placeholder={endPlaceholder}
              />
            </div>
          );

        case "date-range":
          return (
            <div className="flex items-center gap-2">
              <FormControl
                name={`${prefix}-start`}
                type="datetime-local"
                value={
                  Array.isArray(value)
                    ? formatDateForInput(value?.[0]) || ""
                    : ""
                }
                onChange={(e) => handleChange(e.target.value, true)}
                required={isRequired}
                placeholder={startPlaceholder}
              />
              <span className="text-gray-500">{separatorText}</span>
              <FormControl
                name={`${prefix}-end`}
                type="datetime-local"
                value={
                  Array.isArray(value)
                    ? formatDateForInput(value?.[1]) || ""
                    : ""
                }
                onChange={(e) => handleChange(e.target.value, false)}
                required={isRequired}
                placeholder={endPlaceholder}
              />
            </div>
          );

        default:
          return null;
      }
    };

    return renderRangeInput();
  },
);
RangeInput.displayName = "RangeInput";

const OptionInput = React.memo(
  ({ question, name, value, onChange, isRequired, type }) => (
    <div className="space-y-2">
      {question.options?.map((option) => (
        <label key={option.value} className="flex items-center gap-2">
          {type === "radio" ? (
            <Radio
              name={name}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              required={!value && isRequired}
            />
          ) : (
            <Checkbox
              name={name}
              checked={value?.includes(option.value)}
              onChange={(e) => {
                const newValue = e.target.checked
                  ? [...(value || []), option.value]
                  : (value || []).filter((v) => v !== option.value);
                onChange(newValue);
              }}
              required={!(value?.length > 0) && isRequired}
            />
          )}
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  ),
);
OptionInput.displayName = "OptionInput";

const QuestionInput = React.memo(
  ({ question, value, onChange, isRequired, isEnglish, name }) => {
    const placeholder = isEnglish ? "Enter your answer" : "আপনার উত্তর লিখুন";

    const commonProps = {
      value: value ?? "",
      onChange: (e) => onChange(e.target.value),
      required: isRequired,
      placeholder,
    };

    const handleNumberInput = (e) => {
      const numValue = Number(e.target.value);
      if (isNaN(numValue) || e.target.value === "") e.target.value = "";
      if (question.max_value && numValue > question.max_value) {
        e.target.value = question.max_value;
      }
      if (question.min_value && numValue < question.min_value) {
        e.target.value = "";
      }
    };

    switch (question.input_type) {
      case "text":
      case "email":
      case "tel":
        return (
          <FormControl
            name={name}
            type={question.input_type}
            {...commonProps}
          />
        );

      case "textarea":
        return (
          <FormControl
            name={name}
            as="textarea"
            rows={4}
            className="h-[5rem] resize-y items-start py-1"
            {...commonProps}
          />
        );

      case "number":
        return (
          <FormControl
            name={name}
            type="number"
            {...commonProps}
            step={question?.step || "any"}
            onInput={handleNumberInput}
          />
        );

      case "number-range":
      case "date-range":
        return (
          <RangeInput
            question={question}
            value={value}
            onChange={onChange}
            isRequired={isRequired}
            isEnglish={isEnglish}
            prefix={name}
          />
        );

      case "date":
        return (
          <FormControl
            name={name}
            type="datetime-local"
            value={value ? formatDateForInput(value) : ""}
            {...commonProps}
          />
        );

      case "radio":
      case "checkbox":
        return (
          <OptionInput
            name={name}
            question={question}
            value={value}
            onChange={onChange}
            isRequired={isRequired}
            type={question.input_type}
          />
        );

      case "select":
        return (
          <FormControl
            name={name}
            as="select"
            className="w-full rounded border p-2"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            required={isRequired}
          >
            <option value="">
              {isEnglish ? "Select an option" : "একটি অপশন নির্বাচন করুন"}
            </option>
            {question.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FormControl>
        );

      default:
        return null;
    }
  },
);
QuestionInput.displayName = "QuestionInput";

export default QuestionInput;
