export default async function handler(req, res) {
  // зөвхөн POST
  if (req.method !== "POST") return res.status(405).json({ ok:false, error:"Method not allowed" });

  // энгийн нууц шалгах
  const auth = (req.headers.authorization || "").replace("Bearer ", "");
  if (!auth || auth !== process.env.API_SECRET) return res.status(401).json({ ok:false, error:"Unauthorized" });

  try {
    const b = req.body || {};
    // Wix дээрх таны ID-уудтай тааруулж уншина
    const name     = String(b.name     ?? b.nameInput     ?? "");
    const age      = Number(b.age      ?? b.ageInput      ?? 0);
    const gender   = String(b.gender   ?? b.genderInput   ?? "other");
    const heightCm = Number(b.heightCm ?? b.heightInput   ?? 0);
    const weightKg = Number(b.weightKg ?? b.weightInput   ?? 0);

    if (!name || !age || !heightCm || !weightKg) {
      return res.status(400).json({ ok:false, error:"Missing fields" });
    }

    // ЖИЖИГ тооцоо (жишээ)
    const h = heightCm / 100;
    const bmi = +(weightKg / (h*h)).toFixed(1);

    return res.status(200).json({
      ok:true,
      received:{ name, age, gender, heightCm, weightKg },
      metrics:{ bmi }
    });
  } catch (e) {
    return res.status(500).json({ ok:false, error: e?.message || "Server error" });
  }
}
