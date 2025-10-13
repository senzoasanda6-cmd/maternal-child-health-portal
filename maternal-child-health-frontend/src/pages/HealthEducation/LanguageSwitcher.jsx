import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="mb-3 text-end">
      <select
        className="form-select w-auto d-inline-block"
        value={i18n.language}
        onChange={handleChange}
      >
        <option value="en">English</option>
        <option value="zu">Zulu</option>
        <option value="xh">Xhosa</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
