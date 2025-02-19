type FieldErrors = { [key: string]: string };

interface FormField {
  [key: string]: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: FieldErrors;
}

export const validateFormFields = (formField: FormField): ValidationResult => {
  const errors: FieldErrors = {};
  let isValid = true;

  // Utility functions
  const isValidDate = (dateString: string): boolean => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString);
  };

  const isFutureDate = (dateString: string): boolean => {
    const today = new Date();
    const inputDate = new Date(dateString);
    return inputDate > today;
  };

  const calculateAge = (dateString: string): number => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const isPositiveInteger = (value: string): boolean => {
    const regex = /^\d+$/;
    return regex.test(value);
  };

  const isValidEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const isSQLInjection = (input: string): boolean => {
    const sqlKeywords = [
      "SELECT",
      "INSERT",
      "UPDATE",
      "DELETE",
      "DROP",
      "UNION",
      "ALTER",
      "WHERE",
      "FROM",
      "JOIN",
      "TABLE",
      "AND",
      "OR",
      "NOT",
      "CREATE",
      "TRUNCATE",
      "EXEC",
      "EXECUTE",
      "DECLARE",
      "HAVING",
      "ORDER",
      "GROUP",
      "LIMIT",
      "OFFSET",
      "FETCH",
      "INTO",
      "VALUES",
      "SET",
      "DISTINCT",
      "DATABASE",
      "INDEX",
      "VIEW",
      "TRIGGER",
      "PROCEDURE",
      "FUNCTION",
      "PRIMARY",
      "FOREIGN",
      "KEY",
      "CONSTRAINT",
      "CHECK",
      "DEFAULT",
      "REFERENCES",
    ];
    return sqlKeywords.some((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "i");
      return regex.test(input);
    });
  };

  // const containsSpecialCharacters = (value: string): boolean => {
  //   const regex = /[^a-zA-Z0-9]/; // Adjust the regex pattern according to your requirements
  //   return regex.test(value);
  // };

  // Validation rules
  const validationRules: {
    [key: string]: (value: string, formField: FormField) => string | void;
  } = {
    firstname: (value: string) => {
      if (!value) {
        return "First name is required";
      } else if (value.length <= 2) {
        return "First name must be greater than 2 characters long";
      } else if (value.length > 150) {
        return "First name must be less than or equal to 150 characters only";
      } else if (isSQLInjection(value)) {
        return `Possible SQL injection detected in "${value}". Avoid using SQL keywords`;
      }
      return "";
    },
    lastname: (value: string) => {
      if (!value) {
        return "Last name is required";
      } else if (value.length <= 2) {
        return "Last name must be greater than 2 characters long";
      } else if (value.length > 150) {
        return "Last name must be less than or equal to 150 characters only";
      } else if (isSQLInjection(value)) {
        return `Possible SQL injection detected in "${value}". Avoid using SQL keywords`;
      }
      return "";
    },
    email: (value: string) => {
      if (!value) {
        return "Email is required";
      } else if (!isValidEmail(value)) {
        return "Invalid email format";
      } else if (value.length <= 2) {
        return "Email must be greater than 2 characters long";
      } else if (value.length > 150) {
        return "Email must be less than or equal to 150 characters only";
      } else if (isSQLInjection(value)) {
        return `Possible SQL injection detected in "${value}". Avoid using SQL keywords`;
      }
      return "";
    },
    dateOfBirth: (value: string) => {
      if (!isValidDate(value)) {
        return "Invalid date format. Please use YYYY-MM-DD";
      } else if (isFutureDate(value)) {
        return "Date of birth cannot be in the future";
      } else if (calculateAge(value) < 18) {
        return "You must be at least 18 years old";
      }
      return "";
    },
    age: (value: string) => {
      if (!value) {
        return "Age is required";
      } else if (!isPositiveInteger(value)) {
        return "Age must be a positive integer";
      } else if (Number(value) < 1) {
        return "Age of 0 and below is not valid";
      } else if (Number(value) > 150) {
        return "Age must be less than or equal to 100 years old";
      }
      return "";
    },
    contact: (value: string) => {
      if (!value) {
        return "Phone contact number is required";
      } else if (value.length < 7) {
        return "Contact number must not be less than 7 digits";
      } else if (value.length > 15) {
        return "Contact number must not be greater than 15 digits";
      } else if (isSQLInjection(value)) {
        return `Possible SQL injection detected in "${value}". Avoid using SQL keywords`;
      }
      return "";
    },
    address: (value: string) => {
      if (!value) {
        return "Address is required";
      } else if (value.length < 5) {
        return "Address must be at least 5 characters long";
      } else if (value.length > 255) {
        return "Address must be less than or equal to 255 characters";
      } else if (isSQLInjection(value)) {
        return `Possible SQL injection detected in "${value}". Avoid using SQL keywords`;
      }
      return "";
    },
    conditionName: (value: string) => {
      if (!value) {
        return "Condition name is required";
      } else if (value.length <= 2) {
        return "Condition name must be greater than 2 characters long";
      } else if (value.length > 150) {
        return "Condition name must be less than or equal to 150 characters only";
      } else if (isSQLInjection(value)) {
        return `Possible SQL injection detected in "${value}". Avoid using SQL keywords`;
      }
      return "";
    },
    doctorId: (value: string) => {
      if (!value) {
        return "Assign the patient to a Doctor first";
      }
      return "";
    },
    occupation: (value: string) => {
      if (value.length <= 2) {
        return "Occupation must be greater than 2 characters long";
      } else if (value.length > 100) {
        return "Occupation must be less than or equal to 100 characters only";
      } else if (isSQLInjection(value)) {
        return `Possible SQL injection detected in ${value}. Avoid using SQL keywords`;
      }
      return "";
    },
    emergencyContactName: (value: string, formField: FormField) => {
      if (!value) {
        if (formField.emergencyContactNumber) {
          return "Emergency contact name is required if an emergency contact number is provided";
        }
      } else if (value.length <= 2) {
        return "Emergency Contact Name must be greater than 2 characters long";
      } else if (value.length > 100) {
        return "Emergency Contact Name must be less than or equal to 100 characters only";
      } else if (isSQLInjection(value)) {
        return `Possible SQL injection detected in ${value}. Avoid using SQL keywords`;
      }
      return "";
    },
    emergencyContactNumber: (value: string, formField: FormField) => {
      if (!value) {
        if (formField.emergencyContactName) {
          return "Emergency contact number is required if an emergency contact name is provided";
        }
      } else if (value.length < 7) {
        return "Emergency contact number must not be less than 7 digits";
      } else if (value.length > 15) {
        return "Emergency contact number must not be greater than 15 digits";
      } else if (isSQLInjection(value)) {
        return `Possible SQL injection detected in "${value}". Avoid using SQL keywords`;
      }
      return "";
    },
    insuranceProvider: (value: string, formField: FormField) => {
      if (!value) {
        if (formField.insurancePolicyNumber) {
          return "Insurance provider is required if an insurance policy number is provided";
        }
      } else if (value.length <= 2) {
        return "Insurance provider must be greater than 2 characters long";
      } else if (value.length > 100) {
        return "Insurance provider must be less than or equal to 100 characters only";
      } else if (isSQLInjection(value)) {
        return `Possible SQL injection detected in ${value}. Avoid using SQL keywords`;
      }
      return "";
    },
    insurancePolicyNumber: (value: string, formField: FormField) => {
      if (!value) {
        if (formField.insuranceProvider) {
          return "Insurance policy number is required if an insurance provider is provided";
        }
      } else if (value.length < 5) {
        return "Insurance policy number must be at least 5 characters long";
      } else if (value.length > 30) {
        return "Insurance policy number must be less than or equal to 30 characters only";
      } else if (isSQLInjection(value)) {
        return `Possible SQL injection detected in ${value}. Avoid using SQL keywords`;
      }
      return "";
    },
    identificationCardType: (value: string, formField: FormField) => {
      if (!value) {
        if (formField.identificationCardNumber) {
          return "Identification card type is required if an identification card number is provided";
        }
      } else if (isSQLInjection(value)) {
        return `Possible SQL injection detected in ${value}. Avoid using SQL keywords`;
      }
      return "";
    },
    identificationCardNumber: (value: string, formField: FormField) => {
      if (!value) {
        if (formField.identificationCardType) {
          return "Identification card number is required if an identification card type is provided";
        }
      } else if (isSQLInjection(value)) {
        return `Possible SQL injection detected in ${value}. Avoid using SQL keywords`;
      }
      return "";
    },
    allergies: (value: string) => {
      if (isSQLInjection(value)) {
        return `Possible SQL injection detected in ${value}. Avoid using SQL keywords`;
      }
      return "";
    },
    familyMedicalHistory: (value: string) => {
      if (value.length <= 2) {
        return "Family medical history must be greater than 2 characters long";
      } else if (value.length > 100) {
        return "Family medical history must be less than or equal to 100 characters only";
      } else if (isSQLInjection(value)) {
        return `Possible SQL injection detected in ${value}. Avoid using SQL keywords`;
      }
      return "";
    },

    // Add more validation rules as needed...
  };

  // Loop through formField keys and apply validation rules
  for (const key in formField) {
    if (
      formField.hasOwnProperty(key) &&
      validationRules[key as keyof typeof validationRules]
    ) {
      const error = validationRules[key](formField[key], formField);
      if (error) {
        errors[key] = error;
        isValid = false;
      }
    }
  }

  return { isValid, errors };
};

export const matchAgeBirth = (dateString: string) => {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};
