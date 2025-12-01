import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth.js'; // A custom hook to get user data
import HealthEducationLayout from '../../layouts/HealthEducationLayout.jsx';
import DailyCheckIn from '../../components/DailyCheckIn.jsx'; // New Interactive Component
import TrackersHub from '../../components/TrackersHub.jsx'; // New Interactive Component
import PremiumFeatureGate from '../../components/PremiumFeatureGate.jsx'; // A wrapper to gate content
import PostNatalCare from './PostNatalCare.jsx'; // The original component as a fallback

const PostNatalCarePlus = () => {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth(); // Get user and loading state
  const [babyAgeWeeks, setBabyAgeWeeks] = useState(null);

  // Calculate baby's age in weeks once we have the birth date
  useEffect(() => {
    if (user?.baby?.birthDate) {
      const birthDate = new Date(user.baby.birthDate);
      const today = new Date();
      const diffTime = Math.abs(today - birthDate);
      const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
      setBabyAgeWeeks(diffWeeks);
    }
  }, [user]);

  // Show a loading spinner while user data is being fetched
  if (authLoading) {
    return <div>Loading your personalized care...</div>;
  }

  // If no user is logged in, show the original static page
  if (!user) {
    return <PostNatalCare />;
  }

  // --- This is the core logic for the '+' version ---
  return (
    <div>
      {/* Hero Section for Logged-in Users */}
      <header className="plus-hero">
        <h1>{t("postnatalPlusTitle", { name: user.name })}</h1>
        <p>{t("postnatalPlusIntro")}</p>
      </header>

      {/* Personalized Dashboard Section */}
      <section className="personalized-dashboard">
        <h2>{t("dashboardTitle")}</h2>
        
        {/* --- Premium Feature Gating Example --- */}
        <PremiumFeatureGate isPremium={user.isPremium}>
          {/* This content only renders for premium users */}
          <DailyCheckIn userId={user.id} />
        </PremiumFeatureGate>

        {/* --- Conditional Content based on Baby's Age --- */}
        {babyAgeWeeks <= 12 && (
          <div className="milestone-card">
            <h3>{t("fourthTrimesterFocus")}</h3>
            <p>{t("weekSpecificContent", { week: babyAgeWeeks })}</p>
            {/* This content could be fetched from an API based on the baby's age */}
          </div>
        )}

        {/* --- Conditional Content based on Profile --- */}
        {user.profile?.typeOfBirth === 'c-section' && (
          <div className="recovery-card">
            <h3>{t("cSectionRecovery")}</h3>
            <p>{t("cSectionTips")}</p>
            {/* Link to C-section recovery checklist */}
          </div>
        )}

        {/* --- Interactive Tools Hub (Potentially Gated) --- */}
        <PremiumFeatureGate isPremium={user.isPremium} fallback={<p>{t("premiumUpgradePromptForTrackers")}</p>}>
          <TrackersHub userId={user.id} />
        </PremiumFeatureGate>

      </section>

      {/* --- Render the original educational content below --- */}
      <HealthEducationLayout
        title={t("postnatalTitle")}
        intro={t("postnatalIntro")}
        sections={[
          {
            heading: t("motherHealth"),
            items: t("motherItems", { returnObjects: true }),
            image: "https://via.placeholder.com/400x250"
          },
          // ... other sections
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
    </div>
  );
};

export default PostNatalCarePlus;
