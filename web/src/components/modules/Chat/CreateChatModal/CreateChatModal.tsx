import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../../../common/Button/Button";
import Input from "../../../common/Input/Input";
import Label from "../../../common/Label/Label";
import Select from "../../../common/Select/Select";
import styles from "./CreateChatModal.module.css";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "../../../../store";
import { createConversationThunk } from "../../../../store/conversationSlice";
import { promisedToast } from "../../../../utils/toast";
import { useNavigate } from "react-router-dom";
import CustomSelect from './../../../common/CustomSelect/CustomSelect';
import { fetchFriendsThunk } from "../../../../store/authSlice";

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
  const [searchTerm, setSearchTerm] = useState("");
  const { loading } = useSelector((state: AppState) => state.conversationSlice);
  const { friends, user } = useSelector((state: AppState) => state.authSlice);
  const { register, handleSubmit, watch, formState: { errors }, setValue, setError } = useForm<CreateConversationFormValues>({
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

  useEffect(() => {
    dispatch(fetchFriendsThunk(searchTerm))
  }, [dispatch, searchTerm]);

  return (
    <form className={styles.createChatModal} onSubmit={handleSubmit(createConversation)}>
      <h3>Send Custom Message</h3>

      <div>
        <CustomSelect
          placeholder="Conversation Type"
          searchable={true}
          items={[
            { label: "Private", value: "private" },
            { label: "Group", value: "group" },
          ]}
          onChange={(values) => {
            if (!values[0]) return;
            setValue("type", values[0].value, { shouldDirty: true });
            setError("type", { message: "" });
          }}
        />
        <CustomSelect
          placeholder="Reciepients"
          searchable={true}
          items={friends.filter(u => String(u.id) !== String(user?.id)).map(friend => ({
            label: `${friend.first_name} ${friend.last_name} (${friend.email})`,
            value: friend.email
          }))}
          onChange={(values) => {
            setValue("email", values.map(item => item.value).join(","), { shouldDirty: true });
            setError("email", { message: "" });
          }}
          isMulti={watch("type") === "group"}
        />
        {watch("type") === "group" && (
          <Label title="Name" inverted error={errors.name?.message}>
            <Input {...register("name")} />
          </Label>
        )}
        <Label title="Message" inverted error={errors.message?.message}>
          <Input {...register("message")} />
        </Label>

        <Button>{loading ? "Loading..." : "Send"}</Button>
      </div>
    </form>
  )
}