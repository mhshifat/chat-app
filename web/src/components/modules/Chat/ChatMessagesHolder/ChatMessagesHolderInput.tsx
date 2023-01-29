import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./ChatMessagesHolder.module.css";
import { AiOutlinePlus } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { createMessageThunk } from "../../../../store/messageSlice";
import { useParams } from "react-router-dom";
import { AppDispatch, AppState } from "../../../../store";
import {
	ConversationDocument,
	updateConversation,
} from "../../../../store/conversationSlice";
import { useSocket } from "../../../../providers/socket";
import { UserDocument } from "../../../../store/authSlice";
import { BsEmojiSmile } from "react-icons/bs";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface ChatMessagesHolderInputProps {}

export interface CreateMessageFormValues {
	message: string;
	conversationId: string;
}

export interface UpdateMessageFormValues {
	message: string;
}

export default function ChatMessagesHolderInput({}: ChatMessagesHolderInputProps) {
	const { id } = useParams();
	const socket = useSocket();
	const inputRef = useRef<HTMLInputElement>(null);
	const functionsRef = useRef({
		socket,
	});
	const { user } = useSelector((state: AppState) => state.authSlice);
	const { conversations } = useSelector(
		(state: AppState) => state.conversationSlice
	);
	const dispatch = useDispatch<AppDispatch>();
	const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
	const [typing, setTyping] = useState(false);
	const [typingUsers, setTypingUsers] = useState<UserDocument[]>([]);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

	const sendMessage = useCallback(
		(content: string) => {
			if (!id || !content) return;
			dispatch(
				createMessageThunk({
					message: content,
					conversationId: id,
				})
			)
				.unwrap()
				.then((res) => {
					const msg = res.data.result;
					dispatch(
						updateConversation({
							...msg.conversation,
							lastMessageSent: msg,
						})
					);
				});
		},
		[dispatch, id]
	);

	const getConversation = useMemo(() => {
		return conversations.find((c) => String(c.id) === String(id));
	}, [id, conversations]);
	const getTypingText = useMemo(() => {
		return typingUsers.reduce(
			(acc, val) =>
				(acc +=
					val?.first_name +
					" " +
					val?.last_name.charAt(0).toUpperCase() +
					"., "),
			""
		);
	}, [typingUsers]);

	useEffect(() => {
		const socketRef = functionsRef.current.socket;
		const handleUserTyping = ({
			typingUser,
			conversation,
		}: {
			typingUser: UserDocument;
			conversation: ConversationDocument;
		}) => {
			if (String(conversation.id) !== String(id)) return;
			if (conversation.type === "private") setTypingUsers([typingUser]);
			else setTypingUsers((values) => [...values, typingUser]);
		};
		socketRef?.on("isTyping", handleUserTyping);
		const handleUserTypingStoped = ({
			conversation,
		}: {
			conversation: ConversationDocument;
		}) => {
			if (String(conversation.id) !== String(id)) return;
			setTypingUsers([]);
		};
		socketRef?.on("stopedTyping", handleUserTypingStoped);

		return () => {
			socketRef?.off("isTyping", handleUserTyping);
			socketRef?.off("stopedTyping", handleUserTypingStoped);
		};
	}, [id]);
	return (
		<>
			{!!getTypingText.length && (
				<span className={styles.chatMessagesHolderTypingText}>
					{getTypingText.slice(0, getTypingText.length - 2)} is typing...
				</span>
			)}
			<ul className={styles.chatMessagesHolderInput}>
				<li>
					<AiOutlinePlus />
				</li>
				<li>
					<input
            ref={inputRef}
						type="text"
						placeholder="Send Message to #"
						onKeyUp={({ currentTarget, key }) => {
							socket?.emit("isTyping", {
								typingUser: user,
								toUsers:
									getConversation?.users?.filter((u) => u.id !== user?.id) ||
									[],
								conversation: getConversation,
							});
							setTyping(true);
							if (typing) {
								timer && clearTimeout(timer);
								const timeout = setTimeout(() => {
									setTyping(false);
									socket?.emit("stopedTyping", {
										toUsers:
											getConversation?.users?.filter(
												(u) => u.id !== user?.id
											) || [],
										conversation: getConversation,
									});
								}, 1000);
								setTimer(timeout);
							}

							if (key === "Enter") {
                sendMessage(currentTarget.value);
								currentTarget.value = "";
							}
              if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(key)) {
                setCursorPosition(currentTarget.selectionStart ?? currentTarget.value.length);
              }
						}}

            onMouseUp={(e) => {
              if (e.target instanceof HTMLInputElement) {
                setCursorPosition(e.target.selectionStart || e.target.value.length);
              }
            }}
					/>
				</li>
				<li className={styles.chatMessagesHolderSmilyPicker}>
					<BsEmojiSmile onClick={() => setShowEmojiPicker((value) => !value)} />
					{showEmojiPicker && (
						<div className={styles.chatMessagesHolderSmilyPicker__options}>
							<Picker
								data={data}
								onEmojiSelect={({ native }: any) => {
                  if (!inputRef.current || cursorPosition === -1) return;
                  const value = inputRef.current!.value;
                  console.log({ value, cursorPosition, native });
                  inputRef.current!.value = value.slice(0, cursorPosition) + native + value.slice(cursorPosition);
                  setCursorPosition(value => value + native.length);
                }}
								previewPosition="none"
							/>
						</div>
					)}
				</li>
			</ul>
		</>
	);
}
