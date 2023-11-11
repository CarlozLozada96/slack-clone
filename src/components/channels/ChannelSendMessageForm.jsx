import { useAuth } from "../../AuthContext";
import { useState } from "react";
import { apiURL } from "../../App";

export function ChannelSendMessageForm({ channel }) {
  const [message, setMessage] = useState("");
  const { accessData } = useAuth();

  async function handleSend(e, id) {
    e.preventDefault();

    const newMessage = {
      receiver_id: id,
      receiver_class: "Channel",
      body: message,
    };

    const res = await fetch(`${apiURL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...accessData,
      },
      body: JSON.stringify(newMessage),
    });

    setMessage("");
  }

  return (
    <form
      onSubmit={(e) => handleSend(e, channel)}
      className="mt-4 flex gap-2 p-5 py-0"
    >
      <textarea
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="grow text-black p-2 resize-none"
      />
      <button className="px-2 bg-violet-500 rounded-md hover:bg-violet-600">
        Send message
      </button>
    </form>
  );
}