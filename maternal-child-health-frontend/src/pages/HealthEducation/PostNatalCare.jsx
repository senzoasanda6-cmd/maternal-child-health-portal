import React from 'react';
import HealthEducationLayout from '../../components/HealthEducationLayout';

const PostNatalCare = () => {
  return (
    <HealthEducationLayout
      title="Postnatal Care"
      intro="Supporting mothers after childbirth with essential care tips and resources."
      sections={[
        {
          heading: "Mother's Health",
          items: [
            "Physical recovery tips",
            "Mental health support",
            "Nutrition and rest",
          ],
          image: "https://via.placeholder.com/400x250",
        },
        {
          heading: "Baby's Health",
          items: [
            "Vaccination schedule",
            "Feeding guidelines",
            "Growth monitoring",
          ],
          image: "/dizziness-during-pregnancy.png",
        },
      ]}
      followUp={{
        heading: "Follow-up Visits",
        description: "Schedule and importance of postnatal checkups.",
      }}
      cta={{
        label: "Book a Visit",
        link: "/appointments",
      }}
    />
  );
};

export default PostNatalCare;
