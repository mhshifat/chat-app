import * as yup from "yup";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "../../../common/Input/Input";
import Button from "../../../common/Button/Button";
import styles from "./LoginForm.module.css";
import Label from "../../../common/Label/Label";
import { useForm } from "react-hook-form";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "../../../../store";
import { loginUserThunk } from "../../../../store/authSlice";
import { promisedToast } from "../../../../utils/toast";
import { useNavigate } from "react-router-dom";

export interface LoginFormValues {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6).max(32).required(),
});

export default function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: AppState) => state.authSlice);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange"
  });

  const handleUserLogin = useCallback(async (values: LoginFormValues) => {
    await promisedToast(
      dispatch(loginUserThunk(values)).unwrap()
    );
    navigate("/dashboard");
  }, [dispatch, navigate]);
  return (
    <form className={styles.loginForm} onSubmit={handleSubmit(handleUserLogin)}>
      <header>
        <span>
          <BiMessageRoundedDetail />
        </span>
        <h3>Sign In</h3>
        <p>Please fill out the form below to login in.</p>
      </header>
      <div>
        <Label title="Email" inverted error={errors.email?.message}>
          <Input type="email" {...register("email")} />
        </Label>
      </div>
      <div>
        <Label title="Password" inverted error={errors.password?.message}>
          <Input type="password" {...register("password")} />
        </Label>
      </div>

      <Button>{loading ? "Loading..." : "Sign In"}</Button>
    </form>
  )
}
