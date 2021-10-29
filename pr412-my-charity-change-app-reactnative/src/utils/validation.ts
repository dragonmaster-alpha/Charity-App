/* eslint-disable no-console */
export const validateField = (name: string, value: string): string => {
  const { length } = value;
  switch (name) {
    case 'first_name':
      if (length > 30) return 'Maximum Name length is 30 characters';
      if (length > 0 && !value.match(/^[A-Za-z\s]+$/))
        return 'First Name must contain only alphabetical charachters';
      break;
    case 'last_name':
      if (length > 30) return 'Maximum Name length is 30 characters';
      if (length > 0 && !value.match(/^[A-Za-z\s]+$/))
        return 'Last Name must contain only alphabetical charachters';
      break;
    case 'email':
      if (!value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) return 'Invalid email format';
      if (length > 100) return 'Maximum email length is 100 characters';
      break;
    case 'password':
      if (length < 8)
        return `Please include at least 1 number. 
Please include at least 1 capital letter.
Please ensure password is at least 7 characters.`;
      break;
    case 'card_number':
      if (length < 19) return 'Card number length is 16 characters';
      break;
    case 'card_cvc':
      if (length < 3) return 'CVC length is 3 characters';
      break;
    default:
      return '';
  }
  return '';
};
