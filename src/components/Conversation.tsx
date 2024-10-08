import {
  useState,
  useRef,
  Dispatch,
  SetStateAction,
  ReactNode,
  FormEvent,
} from "react";
import type { MessageType } from "./types";
import { editMessage, parentIdFinder } from "@/utils/messageUtils";

// Example data structure
let dataPH = [
  {
    message_id: "afeeec33-da3c-44aa-a952-7f707431781c",
    prompt: "Hi",
    message: "Hello! How can I assist you?",
    created_at: "2024-10-02T16:40:48.047531+00:00",
    children: [
      {
        message_id: "5582200c-c7f0-4dff-9095-b293e2f9951c",
        prompt: "Hi child",
        message: "How are you doing today?",
        created_at: "2024-10-02T16:43:43.743008+00:00",
        children: [
          {
            message_id: "poa5758ae8-bd9e-4c7a-9f26-9004bc0cbe5b",
            prompt: "Hi grandchild",
            message: "I'm doing great, thanks!",
            created_at: "2024-10-02T16:48:04.964597+00:00",
            children: [
              {
                message_id: "a5758ae8-bd9e-4c7a-9f26-9004bc0cbe5d",
                prompt: "Hi great grandchild",
                message: "I'm doing great, thanks!",
                created_at: "2024-10-02T16:48:04.964597+00:00",
                children: [],
              },
              {
                message_id: "a5758ae8-bd9e-4c7a-9f26-9004bc0cbe5p",
                prompt: "Hi great grandchild sibling",
                message: "I'm doing great, thanks!",
                created_at: "2024-10-02T16:48:04.964597+00:00",
                children: [],
              },
            ],
          },
        ],
      },
      {
        message_id: "e3c2a3f7-f1cd-4ffb-b970-c4b22feae0a8",
        prompt: "Hi child 2",
        message: "What can I help you with?",
        created_at: "2024-10-02T16:49:23.786264+00:00",
        children: [
          {
            message_id: "a1748bf7-26bb-4251-8cd8-965b0db38e43",
            prompt: "Hi grandchild 2",
            message: "Can you give me some suggestions?",
            created_at: "2024-10-02T16:51:38.7388+00:00",
            children: [],
          },
        ],
      },
    ],
  },
  {
    message_id: "358f1a84-98db-4131-beeb-aa6b0ed22c8b",
    prompt: "Hi sibling",
    message: "Can I help you with something else?",
    created_at: "2024-10-02T16:42:41.595936+00:00",
    children: [],
  },
];

// Recursive ChatComponent to display prompts, responses, and children
const ChatComponent = ({
  messages,
  originalData,
  level = 0,
  path,
  updatePath,
  setLastActiveMessage,
  activeTopicId,
}: {
  originalData: Array<MessageType> | undefined;
  activeTopicId: string | undefined;
  setLastActiveMessage: Dispatch<SetStateAction<MessageType | undefined>>;
  messages: Array<MessageType> | undefined;
  level?: number;
  path: Array<number>;
  updatePath: Dispatch<SetStateAction<Array<number>>>;
}) => {
  if (messages == undefined || messages.length === 0) {
    return null;
  }
  const handleSiblingSwitch = (siblingIndex: number, currentLevel: number) => {
    const newPath = [...path];
    newPath[currentLevel] = siblingIndex; // Update path from the current level
    updatePath(newPath);
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  // Get the current message based on the path for this level
  let currentMessage = messages[path[level]];

  if (!currentMessage) {
    const newPath = [...path];
    newPath[level] = 0; // Set the current level to 0 (first child) if undefined
    updatePath(newPath);
    return null; // If undefined, return nothing to prevent errors
  }
  setLastActiveMessage(currentMessage);
  return (
    <div className="space-y-4 my-4 grow ">
      <PromptBody
        originalData={originalData}
        path={path}
        level={level}
        activeTopicId={activeTopicId}
        id={currentMessage.message_id}
        message={currentMessage.prompt}
      >
        {messages.length > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setCurrentIndex((prev) => {
                  if (prev > 0) {
                    handleSiblingSwitch(prev - 1, level);
                    return prev - 1;
                  } else {
                    return prev;
                  }
                });
              }}
              className="p-2 transition hover:bg-zinc-800 rounded-lg"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.7071 5.29289C15.0976 5.68342 15.0976 6.31658 14.7071 6.70711L9.41421 12L14.7071 17.2929C15.0976 17.6834 15.0976 18.3166 14.7071 18.7071C14.3166 19.0976 13.6834 19.0976 13.2929 18.7071L7.29289 12.7071C7.10536 12.5196 7 12.2652 7 12C7 11.7348 7.10536 11.4804 7.29289 11.2929L13.2929 5.29289C13.6834 4.90237 14.3166 4.90237 14.7071 5.29289Z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
            <span className="text-xs">
              {currentIndex + 1} / {messages.length}
            </span>
            <button
              onClick={() => {
                setCurrentIndex((prev) => {
                  if (prev < messages.length - 1) {
                    handleSiblingSwitch(prev + 1, level);
                    return prev + 1;
                  } else {
                    return prev;
                  }
                });
              }}
              className="p-2 transition hover:bg-zinc-800 rounded-lg"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.29289 18.7071C8.90237 18.3166 8.90237 17.6834 9.29289 17.2929L14.5858 12L9.29289 6.70711C8.90237 6.31658 8.90237 5.68342 9.29289 5.29289C9.68342 4.90237 10.3166 4.90237 10.7071 5.29289L16.7071 11.2929C16.8946 11.4804 17 11.7348 17 12C17 12.2652 16.8946 12.5196 16.7071 12.7071L10.7071 18.7071C10.3166 19.0976 9.68342 19.0976 9.29289 18.7071Z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
          </div>
        )}
      </PromptBody>

      <ResponseBody response={currentMessage.message} />

      {currentMessage.children?.length > 0 && (
        <ChatComponent
          originalData={originalData}
          activeTopicId={activeTopicId}
          setLastActiveMessage={setLastActiveMessage}
          messages={currentMessage.children} // Pass the children of the current message
          level={level + 1}
          path={path}
          updatePath={updatePath}
        />
      )}
    </div>
  );
};

function ResponseBody({ response }: { response: string }) {
  return (
    <div className="relative">
      <div>
        <p>{response}</p>
      </div>
    </div>
  );
}

function PromptBody({
  message,
  id,
  children,
  activeTopicId,
  path,
  level,
  originalData,
}: {
  originalData: Array<MessageType> | undefined;
  level: number;
  path: Array<number>;
  activeTopicId: string | undefined;
  message: string;
  id: string;
  children: ReactNode;
}) {
  const [edit, setEdit] = useState(false);
  const [update, handleChange] = useState<string>(message);
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const handleEdit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (update && activeTopicId) {
      await editMessage(
        update,
        id,
        activeTopicId,
        parentIdFinder(originalData, path, level)
      );
    }
  };
  if (edit) {
    return (
      <div className="relative mt-20">
        <form onSubmit={(e) => handleEdit(e)}>
          <textarea
            rows={3}
            className="block bg-zinc-700 rounded-3xl text-zinc-300 placeholder:text-zinc-400 px-8 pt-4 pb-14 w-full"
            value={update}
            onChange={(e) => handleChange(e.target.value)}
          ></textarea>
          <div className="flex justify-end absolute inset-x-0 gap-4 bottom-4 px-4">
            <button
              className="border-0 py-2 px-4 rounded-full transition-colors ease-in-out duration-300 bg-zinc-900 hover:bg-zinc-950"
              type="button"
              onClick={() => setEdit(false)}
            >
              Cancel
            </button>
            <button
              className="border-0 py-2 px-4 rounded-full transition-colors ease-in-out duration-300 bg-zinc-100 hover:bg-zinc-200 text-zinc-900"
              type="submit"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    );
  } else {
    return (
      <div className="space-y-1">
        <div
          onMouseOver={() =>
            editButtonRef.current?.classList.toggle("opacity-0")
          }
          onMouseOut={() =>
            editButtonRef.current?.classList.toggle("opacity-0")
          }
          className="w-full flex justify-end"
        >
          <div className="bg-zinc-800 px-6 py-2 cursor-text relative rounded-3xl">
            <button
              ref={editButtonRef}
              onClick={() => setEdit(true)}
              className="opacity-0 absolute rounded-full p-2 -left-10 top-1 max-h6 my-auto hover:bg-zinc-700 transition"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.2929 4.29291C15.0641 2.52167 17.9359 2.52167 19.7071 4.2929C21.4784 6.06414 21.4784 8.93588 19.7071 10.7071L18.7073 11.7069L11.6135 18.8007C10.8766 19.5376 9.92793 20.0258 8.89999 20.1971L4.16441 20.9864C3.84585 21.0395 3.52127 20.9355 3.29291 20.7071C3.06454 20.4788 2.96053 20.1542 3.01362 19.8356L3.80288 15.1C3.9742 14.0721 4.46243 13.1234 5.19932 12.3865L13.2929 4.29291ZM13 7.41422L6.61353 13.8007C6.1714 14.2428 5.87846 14.8121 5.77567 15.4288L5.21656 18.7835L8.57119 18.2244C9.18795 18.1216 9.75719 17.8286 10.1993 17.3865L16.5858 11L13 7.41422ZM18 9.5858L14.4142 6.00001L14.7071 5.70712C15.6973 4.71693 17.3027 4.71693 18.2929 5.70712C19.2831 6.69731 19.2831 8.30272 18.2929 9.29291L18 9.5858Z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
            {message}
          </div>
        </div>
        <div className="w-full flex justify-end">{children}</div>
      </div>
    );
  }
}

export default function Conversation({
  setLastActiveMessage,
  activeTopicId,
  data,
}: {
  data: Array<MessageType> | undefined;
  activeTopicId: string | undefined;
  setLastActiveMessage: Dispatch<SetStateAction<MessageType | undefined>>;
}) {
  const [path, setPath] = useState([0]);
  return (
    <div className="overflow-y-scroll py-20">
      <ChatComponent
        originalData={dataPH}
        activeTopicId={activeTopicId}
        setLastActiveMessage={setLastActiveMessage}
        messages={dataPH}
        path={path}
        updatePath={setPath}
      />
    </div>
  );
}
