export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Only POST' });
  }

  const auth = (req.headers.authorization || '').replace('Bearer ', '');
  if (!auth || auth !== process.env.API_SECRET) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }

  try {
    const b = req.body || {};

    const name   = String(b.nameInput   ?? '');
    const age    = Number(b.ageInput    ?? 0);
    const gender = String(b.genderInput ?? '');
    const weight = Number(b.weightInput ?? 0); // kg
    const height = Number(b.heightInput ?? 0); // cm

    // Жишээ тооцоо: BMI
    const hM = height / 100;
    const bmi = hM > 0 ? +(weight / (hM * hM)).toFixed(1) : null;

    let bmiMsg = 'Мэдээлэл дутуу';
    if (bmi) {
      if (bmi < 18.5) bmiMsg = 'Жингийн дутал';
      else if (bmi < 25) bmiMsg = 'Хэвийн';
      else if (bmi < 30) bmiMsg = 'Илүүдэл жин';
      else bmiMsg = 'Таргалалт';
    }

    return res.status(200).json({
      ok: true,
      summary: `${name} (${gender}, ${age}) – BMI: ${bmi ?? '—'} → ${bmiMsg}`,
      bmi,
      bmiMsg,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
}
