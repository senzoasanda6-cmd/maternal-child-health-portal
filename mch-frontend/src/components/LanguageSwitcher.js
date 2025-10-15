import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng); // optional persistence
  };

  return (
    <div className="dropdown mb-3">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        id="languageDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Language
      </button>
      <ul className="dropdown-menu" aria-labelledby="languageDropdown">
        <li>
          <button className="dropdown-item" onClick={() => changeLanguage('en')}>
            English
          </button>
        </li>
        <li>
          <button className="dropdown-item" onClick={() => changeLanguage('zu')}>
            Zulu
          </button>
        </li>
        <li>
          <button className="dropdown-item" onClick={() => changeLanguage('xh')}>
            Xhosa
          </button>
        </li>
      </ul>
    </div>
  );
};

export default LanguageSwitcher;
