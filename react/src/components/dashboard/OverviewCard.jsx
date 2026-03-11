import React from 'react';

const items = [
  { label: 'Account', value: '20%', color: 'bg-indigo-500' },
  { label: 'Services', value: '40%', color: 'bg-fuchsia-500' },
  { label: 'Restaurant', value: '15%', color: 'bg-violet-600' },
  { label: 'Others', value: '15%', color: 'bg-slate-300' },
];

const OverviewCard = () => {
  return (
    <div className="rounded-[28px] bg-white/70 p-6 shadow-lg">
      <div className="grid items-center gap-6 lg:grid-cols-[1fr_220px]">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Card&apos;s Overview</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Short summary of account categories and service activity.
          </p>

          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`h-4 w-4 rounded-full ${item.color}`} />
                  <span className="font-medium text-slate-800">{item.label}</span>
                </div>
                <span className="font-semibold text-slate-400">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto">
          <div
            className="h-[200px] w-[200px] rounded-full"
            style={{
              background:
                'conic-gradient(#4f6ecb 0deg 90deg, #65d65b 90deg 180deg, #f5a14e 180deg 270deg, #d9d9d9 270deg 360deg)',
            }}
          >
            <div className="flex h-full items-center justify-center">
              <div className="h-[120px] w-[120px] rounded-full bg-[#eef1f5]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewCard;
