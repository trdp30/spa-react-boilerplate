import React, { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>((props, ref) => (
  <input ref={ref} {...props} className="flex-grow p-2 border-0 focus:outline-none focus:ring-0 rounded" />
));

Input.displayName = 'Phone_Input';
export default Input;
