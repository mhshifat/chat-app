import { BiMessageRoundedDetail } from "react-icons/bi";
import Input from "../../../common/Input/Input";
import Button from "../../../common/Button/Button";
import styles from "./RegisterForm.module.css";
import Label from "../../../common/Label/Label";

interface RegisterFormProps {}

export default function RegisterForm({}: RegisterFormProps) {
  return (
    <form className={styles.registerForm}>
      <header>
        <span>
          <BiMessageRoundedDetail />
        </span>
        <h3>Sign Up</h3>
        <p>Please fill out the form below to login in.</p>
      </header>
      <div>
        <Label title="First Name" inverted>
          <Input />
        </Label>
        <Label title="Last name" inverted>
          <Input />
        </Label>
      </div>
      <div>
        <Label title="Email" inverted>
          <Input type="email" />
        </Label>
      </div>
      <div>
        <Label title="Password" inverted>
          <Input type="password" />
        </Label>
      </div>

      <Button>Sign Up</Button>
    </form>
  )
}
