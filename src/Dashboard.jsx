import { useAuth } from "./AuthContext";
import { useEffect, useState } from "react";
import { ChannelDetails } from "./components/channels/ChannelDetails";
import { UserMessageBox } from "./components/users/UserMessageBox";
import { ChannelMessageBox } from "./components/channels/ChannelMessageBox";
import { Channels } from "./components/channels/Channels";
import { AddChannelForm } from "./components/channels/AddChannelForm";
import { SearchUserForm } from "./components/users/SearchUserForm";
import { apiURL } from "./App";
import { UsersList } from "./components/users/UsersList";

export function Dashboard() {
  const { setIsLogin, accessData, setAccessData } = useAuth();
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [showAddChannel, setShowAddChannel] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedChannelName, setSelectedChannelName] = useState(null);
  const [selected, setSelected] = useState("User");

  async function fetchUsers() {
    const response = await fetch(`${apiURL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...accessData,
      },
    });

    const data = await response.json();
    return data;
  }

  useEffect(() => {
    async function getUsers() {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers.data);
    }

    getUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.uid.toLowerCase().includes(query.toLowerCase())
  );

  function handleShowAddChannel() {
    setShowAddChannel((show) => !show);
  }

  function handleUserClick(id, name) {
    setSelectedUser((prev) => (prev === id ? null : id));
    setSelectedUserName((prev) => (prev === name ? null : name));
    if (selectedChannel) {
      setSelectedChannel(null);
      setSelectedChannelName(null);
    }
  }

  function handleChannelClick(id, name) {
    setSelectedChannel((prev) => (prev === id ? null : id));
    setSelectedChannelName((prev) => (prev === name ? null : name));
    if (selectedUser) {
      setSelectedUser(null);
      setSelectedUserName(null);
    }
  }

  return (
    <div
      className=" bg-white-600 text-black grid grid-cols-[250px_1fr] h-screen  font-sans relative"
      style={{ overflowWrap: "anywhere" }}
    >
      <div
        className={`bg-violet-900 h-screen grid ${
          selected === "User"
            ? "grid-rows-[auto_auto_auto_1fr_auto]"
            : "grid-rows-[auto_auto_1fr_auto]"
        } p-3 gap-3 overflow-hidden`}
      >
        <div>
          <p className="text-xl text-center block font-bold">
            Welcome {accessData.uid}!
          </p>
        </div>
        <div className="flex">
          <button
            onClick={() => setSelected("User")}
            disabled={selected === "User"}
            className={`flex-1 ${
              selected === "User" ? "bg-blue-400" : "hover:bg-blue-600"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setSelected("Channels")}
            disabled={selected === "Channels"}
            className={`flex-1 ${
              selected === "Channels" ? "bg-blue-400" : "hover:bg-blue-600"
            }`}
          >
            Channels
          </button>
        </div>
        {selected === "User" ? (
          <>
            {users && <SearchUserForm onSearch={setQuery} query={query} />}
            <div className="overflow-y-auto overflow-x-hidden">
              <UsersList
                query={query}
                filteredUsers={filteredUsers}
                handleUserClick={handleUserClick}
                selectedUser={selectedUser}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-3 overflow-y-auto overflow-x-hidden">
            <Channels
              showAddChannel={showAddChannel}
              setSelectedChannel={handleChannelClick}
              handleShowAddChannel={handleShowAddChannel}
              selectedChannel={selectedChannel}
            />
            {showAddChannel && (
              <AddChannelForm users={users} onShowChannel={setShowAddChannel} />
            )}
          </div>
        )}
        <div>
          <button
            onClick={() => {
              setIsLogin(false);
              setAccessData(null);
            }}
            className="block w-full bg-purple-950 hover:bg-purple-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div
        className={
          selected === "User"
            ? "bg-slate-50"
            : "bg-slate-50 grid grid-cols-[1fr_250px]"
        }
      >
        {selected === "User" && selectedUser && (
          <UserMessageBox
            key={selectedUser}
            selectedUser={selectedUser}
            selectedUserName={selectedUserName}
          />
        )}
        {selected === "Channels" && selectedChannel && (
          <>
            <ChannelMessageBox
              key={selectedChannel}
              selectedChannel={selectedChannel}
              selectedChannelName={selectedChannelName}
              setSelectedChannelName={selectedChannelName}
            />
            <ChannelDetails selectedChannel={selectedChannel} users={users} />
          </>
        )}
      </div>
    </div>
  );
}