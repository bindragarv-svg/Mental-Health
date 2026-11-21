// Mirrors the `Mental` Pydantic model in app.py exactly (field names, types, bounds).
export const TOP_COUNTRIES = ['India', 'USA', 'Canada', 'Australia', 'UK', 'Germany', 'Mexico', 'Turkey', 'France'];

export const FIELDS = [
  { name: 'Age', label: 'Age', type: 'number', int: true, min: 10, max: 100, step: 1, unit: 'years', group: 'Profile' },
  { name: 'Gender', label: 'Gender', type: 'select', options: ['Male', 'Female'], group: 'Profile' },
  { name: 'Country', label: 'Country', type: 'text', placeholder: 'e.g. India', suggestions: TOP_COUNTRIES, group: 'Profile' },
  { name: 'Academic_Level', label: 'Academic level', type: 'select', options: ['High School', 'Undergraduate', 'Graduate'], group: 'Profile' },
  { name: 'Most_Used_Platform', label: 'Most used platform', type: 'select',
    options: ['Facebook', 'LinkedIn', 'Instagram', 'Snapchat', 'Twitter', 'YouTube', 'TikTok', 'LINE', 'KakaoTalk', 'VKontakte', 'WhatsApp', 'WeChat'], group: 'Social media usage' },
  { name: 'Purpose_Of_Use', label: 'Purpose of use', type: 'select', options: ['Networking', 'Education', 'Entertainment', 'News'], group: 'Social media usage' },
  { name: 'Avg_Daily_Usage_Hours', label: 'Avg. daily usage', type: 'number', min: 6, max: 24, step: 0.1, unit: 'hours', group: 'Social media usage' },
  { name: 'Daily_Unlocks', label: 'Daily phone unlocks', type: 'number', int: true, min: 0, step: 1, unit: 'unlocks', group: 'Social media usage' },
  { name: 'Study_Hours', label: 'Study hours', type: 'number', min: 0, max: 24, step: 0.1, unit: 'hours', group: 'Lifestyle' },
  { name: 'Physical_Activity_Hours', label: 'Physical activity', type: 'number', min: 0, max: 24, step: 0.1, unit: 'hours', group: 'Lifestyle' },
  { name: 'Sleep_Hours_Per_Night', label: 'Sleep per night', type: 'number', min: 0, max: 24, step: 0.1, unit: 'hours', group: 'Lifestyle' },
  { name: 'Stress_Level', label: 'Stress level', type: 'select', options: ['Low', 'Medium', 'High', 'Very High'], group: 'Lifestyle' },
];

export const GROUPS = ['Profile', 'Social media usage', 'Lifestyle'];

export const emptyValues = () => Object.fromEntries(FIELDS.map((f) => [f.name, '']));

export function validate(values) {
  const errors = {};
  for (const f of FIELDS) {
    const raw = values[f.name];
    const v = typeof raw === 'string' ? raw.trim() : raw;
    if (v === '' || v === undefined || v === null) { errors[f.name] = 'This field is required'; continue; }
    if (f.type === 'number') {
      const n = Number(v);
      if (Number.isNaN(n)) errors[f.name] = 'Enter a valid number';
      else if (f.int && !Number.isInteger(n)) errors[f.name] = 'Must be a whole number';
      else if (f.min !== undefined && n < f.min) errors[f.name] = `Must be at least ${f.min}`;
      else if (f.max !== undefined && n > f.max) errors[f.name] = `Must be at most ${f.max}`;
    } else if (f.type === 'select' && !f.options.includes(v)) {
      errors[f.name] = 'Choose one of the listed options';
    }
  }
  return errors;
}

export const toPayload = (values) =>
  Object.fromEntries(FIELDS.map((f) => [f.name, f.type === 'number' ? Number(values[f.name]) : String(values[f.name]).trim()]));

export const rangeHint = (f) =>
  f.type !== 'number' ? null : f.max !== undefined ? `${f.min}–${f.max} ${f.unit}` : `min ${f.min} ${f.unit}`;
