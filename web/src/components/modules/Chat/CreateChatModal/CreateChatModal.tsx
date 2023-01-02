import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../../../common/Button/Button";
import Input from "../../../common/Input/Input";
import Label from "../../../common/Label/Label";
import Select from "../../../common/Select/Select";
import styles from "./CreateChatModal.module.css";
import { useForm } from "react-hook-form";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "../../../../store";
import { createConversationThunk } from "../../../../store/conversationSlice";
import { promisedToast } from "../../../../utils/toast";
import { useNavigate } from "react-router-dom";

interface CreateChatModalProps {
  isOpen?: boolean;
  closeModal?: () => void;
}

export interface CreateConversationFormValues {
  type: string;
  email: string;
  message: string;
  name?: string;
}

const schema = yup.object().shape({
  type: yup.string().required(),
  email: yup.string().required(),
  message: yup.string().required(),
  name: yup
  .string()
  .when('type', {
      is: "group",
      then: yup.string().required(),
  }),
});
export default function CreateChatModal({ isOpen, closeModal }: CreateChatModalProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: AppState) => state.conversationSlice);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<CreateConversationFormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange"
  });

  const createConversation = useCallback(async (values: CreateConversationFormValues) => {
    try {
      const res = await promisedToast(
        dispatch(createConversationThunk(values)).unwrap()
      );
      closeModal?.();
      navigate(`/conversations/${res?.data?.result?.id}`);
    } catch (err) {
      console.log(err);
    }
  }, [dispatch, closeModal, navigate]);
  return (
    <form className={styles.createChatModal} onSubmit={handleSubmit(createConversation)}>
      <h3>Send Custom Message</h3>

      <div>
        <Label title="Conversation type" inverted error={errors.type?.message}>
          <Select
            options={[
              { label: "Private", value: "private" },
              { label: "Group", value: "group" },
            ]}
            {...register("type")}
          />
        </Label>
        {watch("type") === "group" && (
          <Label title="Name" inverted error={errors.name?.message}>
            <Input {...register("name")} />
          </Label>
        )}
        <Label title="Email" inverted error={errors.email?.message}>
          <Input {...register("email")} />
        </Label>
        <Label title="Message" inverted error={errors.message?.message}>
          <Input {...register("message")} />
        </Label>

        <Button>{loading ? "Loading..." : "Send"}</Button>
      </div>
    </form>
  )
}