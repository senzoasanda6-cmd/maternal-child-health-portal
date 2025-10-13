import React from 'react';
import { useTranslation } from 'react-i18next';
import HealthEducationLayout from './HealthEducationLayout';

const PostNatalCare = () => {
  const { t } = useTranslation();

  return (
    <HealthEducationLayout
      title={t("postnatalTitle")}
      intro={t("postnatalIntro")}
      sections={[
        {
          heading: t("motherHealth"),
          items: t("motherItems", { returnObjects: true }),
          image: "https://via.placeholder.com/400x250"
        },
        {
          heading: t("babyHealth"),
          items: t("babyItems", { returnObjects: true }),
          image: "/dizziness-during-pregnancy.png"
        },
        {
          heading: t("emotionalSupport"),
          items: t("emotionalItems", { returnObjects: true }),
          image: "https://via.placeholder.com/400x250"
        }
      ]}
      followUp={{
        heading: t("followUpHeading"),
        description: t("followUpDescription")
      }}
      cta={{
        label: t("ctaLabel"),
        link: "/appointments",
        description: t("ctaDescription")
      }}
    />
  );
};

export default PostNatalCare;
