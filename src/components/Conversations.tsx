import { useState } from "react";
import { MessageType, VersionType } from "./types";

export default function Conversations({
  version,
  handleEdit,
  messages,
  loading,
  rspLoading,
}: {
  loading: boolean;
  rspLoading: boolean;
  messages: Array<MessageType>;
  version: VersionType;
  handleEdit: (prompt: string, versionId: string) => void;
}) {
  if (!version) {
    return null;
  }
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <div>{version.id}</div>
      <div>
        {messages.map((message: MessageType, idx) => {
          if (idx === messages.length - 1) {
            return (
              <ConversationBlock
                key={message.id}
                message={message}
                last={true}
              />
            );
          } else {
            <ConversationBlock
              key={message.id}
              message={message}
              last={false}
            />;
          }
        })}
      </div>
    </div>
  );

  function ConversationBlock({
    message,
    last,
  }: {
    message: MessageType;
    last: boolean;
  }) {
    return (
      <div>
        <PromptBody message={message.prompt} />
        <ResonseBody message={message.response} last={last} />
        <ResponseLoader />
      </div>
    );
  }

  function PromptBody({ message }: { message: string }) {
    return <div>{message}</div>;
  }

  function ResonseBody({ message, last }: { message: string; last: boolean }) {
    if (last) {
    } else {
      return <div>{message}</div>;
    }
  }

  // Edit button available just on the last prompt of the user of any given version
  function EditButton() {
    return <span>Edit</span>;
  }

  function ResponseLoader() {
    if (rspLoading) {
      return <div>Loading...</div>;
    } else {
      return null;
    }
  }

  //modal form triggered when edit button is clicked
  function EditForm({ editData }: { editData: string }) {
    const [prompt, setPrompt] = useState("");
    return (
      <div>
        <p>Edit your last prompt to get a different result</p>
        <form onSubmit={() => handleEdit(prompt, version.id)}>
          <input
            defaultValue={editData}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          ></input>
          <button type="submit">Edit</button>
        </form>
      </div>
    );
  }
}
