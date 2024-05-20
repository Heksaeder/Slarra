import DOMPurify from 'dompurify';

// Sanitize function
const sanitizeInput = (input: any) => {
  return DOMPurify.sanitize(input);
};

export { sanitizeInput };