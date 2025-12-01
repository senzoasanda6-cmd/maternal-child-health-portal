import React from 'react';

// Simple gating wrapper: renders `children` when `isPremium` is truthy,
// otherwise renders `fallback` or a default prompt.
const PremiumFeatureGate = ({ isPremium, fallback = null, children }) => {
  if (isPremium) return <>{children}</>;

  if (fallback) return <>{fallback}</>;

  return (
    <div className="premium-feature-gate">
      <p>This feature is available for premium users. Upgrade to access.</p>
    </div>
  );
};

export default PremiumFeatureGate;
