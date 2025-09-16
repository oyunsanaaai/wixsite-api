export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST')
    return res.status(405).json({ ok: false, error: 'Only POST' });

  // Simple auth
  const auth = (req.headers.authorization || '').replace('Bearer ', '');
  if (!auth || auth !== process.env.API_SECRET)
    return res.status(401).json({ ok: false, error: 'Unauthorized' });

  const b = req.body || {};
  const hM = Number(b.heightInput || 0) / 100;
  const w = Number(b.weightInput || 0);

  const bmi = hM > 0 ? Number((w / (hM * hM)).toFixed(1)) : null;

  let bmiMsg = 'Мэдээлэл дутуу';
  if (bmi) {
    if (bmi < 18.5) bmiMsg = 'Жингийн дутал';
    else if (bmi < 25) bmiMsg = 'Хэвийн';
    else if (bmi < 30) bmiMsg = 'Илүүдэл жин';
    else bmiMsg = 'Таргалалт';
  }

  return res.status(200).json({ ok: true, bmi, bmiMsg });
}
