import Group from "../components/common/Group/Group";
import ChatLayout from "../components/modules/Chat";

export default function Dashboard() {
  return (
    <Group height="100vh">
      <ChatLayout>
        <Group direction="column" justify="center" align="center" flex="1">
          <h3>Conversations</h3>
          <p>Please select a conversation to see all the messages</p>
        </Group>
      </ChatLayout>
    </Group>
  )
}