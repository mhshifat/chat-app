import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState, MouseEvent } from "react";
import styles from "./CustomSelect.module.css";
import { HiOutlineChevronDown, HiOutlineChevronUp, HiOutlinePlus } from "react-icons/hi";
import { RxDividerVertical } from "react-icons/rx";
import { BsSearch } from "react-icons/bs";
import Dropdown from './../Dropdown/Dropdown';

type SelectedValueProps = {
  label: string;
  value: string;
}

type OptionsItemProps = {
  label: string;
  value: string;
  component?: JSX.Element
}

type CommonProps = {
  searchable?: boolean;
  onSearch?: (value: string) => void;
  onChange: (value: SelectedValueProps[]) => void;
  // Defalut
  placeholder?: string;
  items: OptionsItemProps[] | JSX.Element;
  // Multi
  isMulti?: boolean;
}

type CustomSelectProps = CommonProps;

export default function CustomSelect({ placeholder = "-- Select --", isMulti, items, searchable, onSearch, onChange }: CustomSelectProps) {
  const defaultSelectValues = useMemo(() => ({
    label: placeholder,
    value: ""
  }), [placeholder]);
  const handleRef = useRef<HTMLDivElement>(null);
  const [defalutSelectWidth, setDefalutSelectWidth] = useState(0);
  const [openSelectOptions, setOpenSelectOptions] = useState(false);
  const [selectedValues, setSelectedValues] = useState<SelectedValueProps[]>([defaultSelectValues]);
  const [searchValue, setSearchValue] = useState("");
  const functionsRef = useRef({
    onChange
  });

  const handleToggleSelect = useCallback(() => {
    setOpenSelectOptions(value => !value);
  }, []);
  const clearSelectValues = useCallback((e: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>) => {
    e.stopPropagation();
    setSelectedValues([defaultSelectValues]);
  }, [defaultSelectValues]);
  const handleSetSelectValue = useCallback((item: OptionsItemProps) => {
    const currentValue = { label: item.label, value: item.value };
    if (isMulti) {
      setSelectedValues(values => {
        const newValues = [...values, currentValue].filter(item => item.label !== placeholder);
        return newValues;
      });
      return;
    }
    setSelectedValues([currentValue]);
    handleToggleSelect();
  }, [handleToggleSelect, isMulti, placeholder]);
  const handleOnSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (onSearch) return onSearch(e.target.value);
    setSearchValue(e.target.value);
  }, [onSearch]);
  const filteredOptions = useMemo(() => {
    return Array.isArray(items) ? items.filter(item => item.label.toLowerCase().includes(searchValue)).filter(item => isMulti ? !selectedValues.find(el => el.label === item.label) : item) : []
  }, [searchValue, items, isMulti, selectedValues]);
  const handleDeleteValueFormValues = useCallback((e: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>, label: string) => {
    e.stopPropagation();
    setSelectedValues(values => {
      const newValues = values.filter(v => v.label !== label);
      if (!newValues.length) newValues.push(defaultSelectValues);
      return newValues;
    });
  }, [defaultSelectValues]);
  
  useEffect(() => {
    if (!handleRef.current) return;
    setDefalutSelectWidth(handleRef.current.offsetWidth);
  }, []);
  
  useEffect(() => {
    if (selectedValues.length === 1 && selectedValues[0].label === defaultSelectValues.label) return functionsRef.current?.onChange?.([]);
    functionsRef.current?.onChange?.(selectedValues);
  }, [selectedValues, defaultSelectValues]);

  return (
    <div className={styles.customSelect}>
      <Dropdown
        open={openSelectOptions}
        dropdownEl={({ openDropdown, dropDownWidth }) => (
          (
            <div
              className={styles.customSelectOptions}
              style={{
                width: dropDownWidth ?? (handleRef.current ? window.getComputedStyle(handleRef.current)?.width : "100%"),
                ...openDropdown?{
                  borderTopLeftRadius: 0, 
                  borderTopRightRadius: 0,
                  borderTop: 0
                }:{}
              }}
            >
              {searchable && (
                <div className={styles.customSelectSearch}>
                  <span className={styles.customSelectSearch__icon}>
                    <BsSearch />
                  </span>
                  <input
                    type="text"
                    value={searchValue}
                    onChange={handleOnSearch}
                    className={styles.customSelectSearch__input} 
                  />
                  {searchValue && (
                    <span
                      className={styles.customSelectSearch__icon}
                      onClick={() => setSearchValue("")}
                    >
                      <HiOutlinePlus className={styles.crossIcon} />
                    </span>
                  )}
                </div>
              )}
              {Array.isArray(items) ? (
                <ul className={styles.customSelectItems}>
                  {filteredOptions.map((selectItem) => (
                    <li
                      key={selectItem.label} 
                      className={styles.customSelectItem} 
                      onClick={() => handleSetSelectValue(selectItem)}
                    >{selectItem.label}</li>
                  ))}
                </ul>
              ) : items}
            </div>
          )
        )}
      >
        {({ openDropdown, dropDownWidth }) => (
          <div
            ref={handleRef}
            className={styles.customSelectHandle}
            style={{
              ...openDropdown?{
                borderBottomLeftRadius: 0, 
                borderBottomRightRadius: 0, 
              }:{},
            }}
            onClick={handleToggleSelect}
          >
            <div
              className={styles.customSelectValues}
              style={{
                ...isMulti?{
                  maxWidth: (dropDownWidth || defalutSelectWidth) - 120
                }:{}
              }}
            >
              {selectedValues.map(({ label }) => (
                <span key={label} className={styles.customSelectValue}>
                  <p className={isMulti && !!selectedValues.find(item => item.value !== "") ? styles.customSelectChip : ""}>
                    {label}
                    {isMulti && !!selectedValues.find(item => item.value !== "") && (
                      <span onClick={(e) => handleDeleteValueFormValues(e, label)}>
                        <HiOutlinePlus className={styles.crossIcon} />
                      </span>
                    )}
                  </p>
                </span>
              ))}
            </div>
            <div className={styles.customSelectIcons}>
              {!!selectedValues.length && !!selectedValues.find(item => item.value !== "") && (
                <>
                  <span onClick={clearSelectValues}>
                    <HiOutlinePlus className={styles.crossIcon} />
                  </span>
                  <span>
                    <RxDividerVertical />
                  </span>
                </>
              )}
              <span>
                {!openDropdown ? (
                  <HiOutlineChevronDown />
                ) : (
                  <HiOutlineChevronUp />
                )}
              </span>
            </div>
          </div>
        )}
      </Dropdown>
    </div>
  )
}