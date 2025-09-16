export default function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;
    // энд data-г ашиглаж AI руу илгээнэ
    res.status(200).json({ message: "Амжилттай!", received: data });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
