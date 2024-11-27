import React, { memo } from 'react';
import Select, { StylesConfig } from 'react-select';
import { get } from 'lodash';
import { DropdownProps, Option } from './types';

export const reactSelectDefaultStyles: StylesConfig<Option> = {
  input: (props: object) => ({
    ...props,
    input: {
      boxShadow: 'none !important',
    },
  }),
  indicatorSeparator: (props: object) => ({
    ...props,
    display: 'none',
  }),
  placeholder: (props: object) => ({
    ...props,
    color: '#333940',
    opacity: 0.4,
    fontWeight: 400,
    fontSize: '14px',
  }),
  option: (props, { data }) => ({
    ...props,
    fontSize: '14px',
    backgroundColor: data.isSelected ? 'rgba(3, 105, 161, 1)' : props.backgroundColor,
  }),
  singleValue: (props: object) => ({
    ...props,
    fontSize: '14px',
  }),
  multiValue: (props: object) => ({
    ...props,
    backgroundColor: '#2F80ED',
    borderRadius: '6px',
  }),
  multiValueLabel: (props: object) => ({
    ...props,
    color: '#FFFFFF',
    fontFamily: 'nano-sans',
  }),
  multiValueRemove: (props: object) => ({
    ...props,
    color: '#FFFFFF',
  }),
};

const Dropdown: React.FC<DropdownProps> = (props) => {
  const {
    value,
    isDisabled,
    isLoading,
    isClearable,
    name,
    options,
    onChange,
    emptyLabel,
    labelKey,
    primaryKey,
    placeholder,
    isSearchable,
    isMulti,
    customStyles,
    dataTestId,
  } = props;

  const noOptionsMessage = () => emptyLabel;
  const formatOptionLabel = (option: Option) => String(get(option, labelKey || '', option));
  const getOptionValue = (option: Option) => String(get(option, primaryKey || '', option));

  return (
    <Select
      data-testid={dataTestId}
      value={value}
      onChange={onChange}
      isDisabled={isDisabled}
      isLoading={isLoading}
      isClearable={isClearable}
      isSearchable={isSearchable}
      name={name}
      placeholder={placeholder}
      options={options}
      getOptionValue={getOptionValue}
      getOptionLabel={formatOptionLabel}
      formatOptionLabel={formatOptionLabel}
      noOptionsMessage={noOptionsMessage}
      styles={{ ...reactSelectDefaultStyles, ...customStyles }}
      isMulti={isMulti}
    />
  );
};

export default memo(Dropdown);
