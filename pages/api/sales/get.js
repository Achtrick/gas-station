import auth from "@/middlewares/admin-auth";
import Sale from "@/models/sale.model";
import connectDB from "@/utils/config/connectDB";
import nc from "next-connect";

const handler = nc();

handler.post(auth, async (req, res) => {
  const { startDate, endDate } = req.body;
  await connectDB();

  try {
    const start = startDate.includes("T")
      ? startDate
      : startDate.split("-").reverse().join("-") + "T00:00:00.000Z";
    const end = endDate.includes("T")
      ? endDate
      : endDate.split("-").reverse().join("-") + "T00:00:00.000Z";

    const sales = await Sale.find({
      createdAt: { $gte: start, $lte: end },
    });

    res.status(200).json(sales);
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
