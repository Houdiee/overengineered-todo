import { useState } from "react";
import { useAuth, type TodoEntry } from "./AuthContext";
import { App, Button, Flex, Input, List, Typography } from "antd";
import Checkbox from "antd/es/checkbox/Checkbox";
import axios from "axios";
import { SavingSaved, SavingSpinner } from "./Saving";

function TodoList() {
  const { user, updateEntries, logout } = useAuth();
  const { notification } = App.useApp();

  const [newEntry, setNewEntry] = useState<string>("");
  const userEntries = user?.entries || [];
  const [isSaving, setIsSaving] = useState(false);

  const saveRequest = async (entriesToSave: Array<TodoEntry>) => {
    setIsSaving(true);
    await axios.put("http://localhost:5000/api/entries", entriesToSave, {
      headers: {
        Authorization: `Bearer ${user!.token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(() => setIsSaving(false))
    .catch(error => {
      let errorMessage = "There was an issue saving your entries";

      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data;
      }

      notification.error({
        message: "Failed to save",
        description: errorMessage,
      });
      console.log(`Error: ${error}`);
    })
  };

  const addEntry = async () => {
    if (userEntries.find(value => value.title == newEntry)) {
      notification.warning({
        message: "Entry already exists",
        description: `Entry "${newEntry}" already exists`,
      });
      return;
    }

    if (newEntry?.trim() !== "") {
      const updatedEntries = [...userEntries, { title: newEntry, isCompleted: false }];
      updateEntries(updatedEntries);
      setNewEntry("");
      await saveRequest(updatedEntries);
    }
  };

  const handleDelete = async (item: TodoEntry) => {
    const updatedEntries = userEntries.filter((entry) => entry.title !== item.title);
    updateEntries(updatedEntries);
    await saveRequest(updatedEntries);
  };

  const handleCheckboxChange = async (checked: boolean, item: TodoEntry) => {
    const updatedEntries = userEntries.map((entry) =>
      entry.title === item.title ? { ...entry, isCompleted: checked } : entry
    );
    updateEntries(updatedEntries);
    await saveRequest(updatedEntries);
  };

  const { Title } = Typography;
  return (
    <>
      <Button
        onClick={() => {
          logout();
          notification.info({
            message: "Logged Out",
            description: "You have been logged out of your account",
        })}}
        className="m-4"
      >
        Log Out
      </Button>
      <Flex justify="center" className="!mt-5">
        <Flex vertical align="center" className="w-2/7">
          <Title>{user?.username}'s Todo List</Title>
          <Flex className="w-full gap-2 !mb-2">
            <Input
              className="flex-grow"
              size="large"
              placeholder="Add an entry..."
              value={newEntry || ""}
              onChange={(e) => setNewEntry(e.target.value)}
              onPressEnter={addEntry}
            />
            <Button type="primary" size="large" onClick={addEntry}>
              Add entry
            </Button>
          </Flex>
          <List
            bordered
            size="large"
            className="w-full"
            itemLayout="horizontal"
            footer={isSaving ? <SavingSpinner/> : <SavingSaved/>  }
            dataSource={userEntries}

            renderItem={(item) => (
              <List.Item>
                <Flex justify="space-between" align="middle" className="w-full items-center">
                  <Checkbox
                    checked={item.isCompleted}
                    onChange={(e) => handleCheckboxChange(e.target.checked, item)}
                  />
                  <Typography.Text
                    className={`flex-grow ml-2 ${item.isCompleted ? "line-through text-gray-500" : ""}`}
                  >
                    {item.title}
                  </Typography.Text>
                  <Button
                    type="default"
                    className="hover:!text-red-600 hover:!border-red-600"
                    onClick={() => handleDelete(item)}>
                    delete
                  </Button>
                </Flex>
              </List.Item>
            )}
          />
        </Flex>
      </Flex>
    </>
  );
}

export default TodoList;
