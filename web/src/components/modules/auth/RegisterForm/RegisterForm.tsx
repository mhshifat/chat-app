import * as yup from "yup";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "../../../common/Input/Input";
import Button from "../../../common/Button/Button";
import styles from "./RegisterForm.module.css";
import Label from "../../../common/Label/Label";
import { useForm } from "react-hook-form";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "../../../../store";
import { registerUserThunk } from "../../../../store/authSlice";
import { promisedToast } from "../../../../utils/toast";
import { useNavigate } from "react-router-dom";

export interface RegisterFormValues {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

const schema = yup.object().shape({
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).max(32).required(),
});

export default function RegisterForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: AppState) => state.authSlice);
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange"
  });

  const handleUserRegistration = useCallback(async (values: RegisterFormValues) => {
    await promisedToast(
      dispatch(registerUserThunk(values)).unwrap()
    );
    navigate("/dashboard");
  }, [dispatch, navigate]);
  return (
    <form className={styles.registerForm} onSubmit={handleSubmit(handleUserRegistration)}>
      <header>
        <span>
          <BiMessageRoundedDetail />
        </span>
        <h3>Sign Up</h3>
        <p>Please fill out the form below to login in.</p>
      </header>
      <div>
        <Label title="First Name" inverted error={errors.first_name?.message}>
          <Input {...register("first_name")} />
        </Label>
        <Label title="Last name" inverted error={errors.last_name?.message}>
          <Input {...register("last_name")} />
        </Label>
      </div>
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

      <Button>{loading ? "Loading..." : "Sign Up"}</Button>
    </form>
  )
}
