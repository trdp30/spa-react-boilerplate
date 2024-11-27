import { SingleValue, MultiValue } from 'react-select';
export interface Option {
  key?: number | string;
  value?: number | string;
  isDisabled?: boolean;
  isSelected?: boolean;
}

export interface DropdownProps {
  value?: SingleValue<Option> | MultiValue<Option>;
  isDisabled?: boolean;
  isLoading?: boolean;
  isClearable?: boolean;
  name?: string;
  options?: Option[];
  onChange?: () => void;
  emptyLabel?: string;
  labelKey?: string;
  primaryKey?: string;
  placeholder?: string;
  isSearchable?: boolean;
  isMulti?: boolean;
  customStyles?: Record<string, object>;
  dataTestId?: string;
}
