import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { XIcon } from "lucide-react";

interface AllergiesInputProps {
  initialAllergies?: string;
  onAllergiesChange?: (allergies: string[]) => void;
}

const AllergiesInput: React.FC<AllergiesInputProps> = ({
  initialAllergies = "",
  onAllergiesChange,
}) => {
  const [allergiesInputValue, setAllergiesInputValue] = useState<string>("");
  const [allergiesArray, setAllergiesArray] = useState<string[]>([]);
  const [previousAllergiesArray, setPreviousAllergiesArray] = useState<
    string[]
  >([]);

  // Initialize allergies from initial value
  useEffect(() => {
    if (initialAllergies) {
      const initialArray = initialAllergies
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);
      setAllergiesArray(initialArray);
    }
  }, [initialAllergies]);

  // Trigger callback when allergies change
  useEffect(() => {
    onAllergiesChange?.(allergiesArray);
  }, [allergiesArray, onAllergiesChange]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const lastChar = value.charAt(value.length - 1);

    if (lastChar === " " || lastChar === ",") {
      const trimmedValue = value.slice(0, -1).trim();
      if (trimmedValue) {
        setAllergiesArray((prevArray) => {
          // Store previous state before updating
          setPreviousAllergiesArray(prevArray);
          return [...prevArray, trimmedValue];
        });
        setAllergiesInputValue("");
      }
    } else {
      setAllergiesInputValue(value);
    }
  };

  const removeItem = (index: number) => {
    setAllergiesArray((prevArray) => {
      // Store previous state before updating
      setPreviousAllergiesArray(prevArray);
      return prevArray.filter((_, i) => i !== index);
    });
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <label
        htmlFor="allergies"
        className="text-xs text-gray-500 dark:text-gray-400"
      >
        Allergies{" "}
        <span className="text-[10px] text-gray-500 dark:text-gray-400">
          (Press space to add more allergy)
        </span>
      </label>
      <Input
        type="text"
        value={allergiesInputValue}
        onChange={handleInputChange}
        placeholder="Type and add items with space or comma"
      />

      {/* Previous Allergies Display */}
      {previousAllergiesArray.length > 0 && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Previous Allergies:
          <div className="flex gap-1 mt-1 overflow-auto">
            {previousAllergiesArray.map((item, index) => (
              <Badge key={index} className="opacity-50">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Current Allergies Display */}
      <ul className="w-full shadow-lg p-3 flex flex-auto gap-1 overflow-auto card-scroll">
        {allergiesArray.map((item, index) => (
          <Badge
            key={index}
            className="bg-light hover:bg-light-100 dark:bg-dark dark:hover:bg-dark-100 text-dark dark:text-white flex flex-row items-center gap-1"
          >
            {item}
            <XIcon
              onClick={() => removeItem(index)}
              className="cursor-pointer w-4 h-4 text-red-500"
            />
          </Badge>
        ))}
      </ul>
    </div>
  );
};

export default AllergiesInput;
