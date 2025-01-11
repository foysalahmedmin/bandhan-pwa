export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const validateBDPhoneNumber = (phoneNumber) => {
  const phoneRegex = /^(?:\+88|88)?01[3-9]\d{8}$/;
  return phoneRegex.test(phoneNumber);
};
