import Group from "../components/common/Group/Group";
import ChatLayout from "../components/modules/Chat";
import ChatMessagesHolder from "../components/modules/Chat/ChatMessagesHolder/ChatMessagesHolder";

export default function Conversation() {
  return (
    <Group height="100vh">
      <ChatLayout>
        <Group direction="column" justify="center" align="center" flex="1">
          <ChatMessagesHolder />
        </Group>
      </ChatLayout>
    </Group>
  )
}