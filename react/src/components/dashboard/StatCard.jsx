import React from 'react';

const variantMap = {
  purple: 'from-violet-600 to-indigo-600',
  pink: 'from-violet-600 via-fuchsia-500 to-pink-500',
  violet: 'from-purple-500 to-violet-700',
  dark: 'from-fuchsia-500 to-violet-800',
};

const StatCard = ({ title, value, icon: Icon, variant = 'purple' }) => {
  return (
    <div
      className={`rounded-[24px] bg-gradient-to-r ${variantMap[variant]} p-5 text-white shadow-lg`}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
          <Icon size={22} />
        </div>

        <div>
          <p className="text-3xl font-bold leading-none">{value}</p>
          <p className="mt-2 text-sm text-white/90">{title}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;