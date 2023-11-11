import { useAuth } from "../../AuthContext";
import { useState } from "react";
import { apiURL } from "../../App";

export function AddChannelMember({
  users,
  setShowAddChannelMember,
  selectedChannel,
}) {
  const [query, setQuery] = useState("");
  const { accessData } = useAuth();

  const filteredUsers = users.filter((user) =>
    user.uid.toLowerCase().includes(query.toLowerCase())
  );

  async function fetchAddChannelMember(id) {
    const res = await fetch(`${apiURL}/channel/add_member`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...accessData,
      },
      body: JSON.stringify({
        id: selectedChannel,
        member_id: id,
      }),
    });
  }

  function handleAddMember(uid, id) {
    const confirmation = confirm(`Do you want to add ${uid} to the channel?`);

    if (confirmation) {
      fetchAddChannelMember(id);
      setShowAddChannelMember(false);
    } else {
      return;
    }
  }

  return (
    <div className="overflow-y-auto p-3 space-y-3">
      <input
        type="text"
        placeholder="Search a user"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="text-black block w-full"
      />
      <div className="flex gap-3 flex-col">
        {query.length > 3 &&
          (filteredUsers.length < 25 ? (
            filteredUsers.map((user) => (
              <p
                key={user.id}
                onClick={() => handleAddMember(user.uid, user.id)}
                className="cursor-pointer hover:bg-blue-300"
              >
                {user.uid}
              </p>
            ))
          ) : (
            <p>{filteredUsers.length} results found</p>
          ))}
      </div>
    </div>
  );
}