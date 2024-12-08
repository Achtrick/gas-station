import ConnectedGuard from "@/components/guards/connectedGuard";
import styles from "@/styles/Index.module.scss";
import { getError } from "@/utils/shared/getError";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function Home() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("api/auth/login", formData);
      dispatch({ type: "USER_LOGIN", payload: data });
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoading(false);
    }
  };

  return (
    <ConnectedGuard>
      <section className={styles["login-container"]}>
        <form id="form" onSubmit={login}>
          <img src="/logo.jpg" />
          <input
            required
            type="email"
            name="email"
            placeholder="email"
            className="defaultInput"
            onChange={onChange}
          />
          <input
            required
            type="password"
            name="password"
            placeholder="password"
            className="defaultInput"
            onChange={onChange}
          />
          <br />
          <Button
            disabled={loading}
            type="submit"
            form="form"
            style={{
              background: "black",
              color: "white",
              height: "35px",
              width: "80px",
            }}
            variant="contained"
          >
            {loading ? (
              <CircularProgress style={{ color: "white" }} size={20} />
            ) : (
              "login"
            )}
          </Button>
        </form>
      </section>
    </ConnectedGuard>
  );
}
