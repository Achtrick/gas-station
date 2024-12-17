import jwt from "jsonwebtoken";
import nc from "next-connect";

const handler = nc();

handler.post(async (req, res) => {
  const { email, password } = req.body;
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  try {
    if (
      email.toLowerCase() === ADMIN_EMAIL.toLocaleLowerCase() &&
      password.toLowerCase() === ADMIN_PASSWORD.toLocaleLowerCase()
    ) {
      res.status(200).json({
        email: email,
        token: jwt.sign({ token: email }, process.env.JWT_SECRET, {
          expiresIn: "365d",
        }),
      });
    } else {
      res.status(403).json({ message: "Invalid credentials !" });
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
