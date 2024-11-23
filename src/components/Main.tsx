import PromptForm from "./PromptForm";
import Topbar from "./Topbar";
import Conversation from "./Conversation";
import Sidebar from "./Sidebar";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { MessageType, TopicType } from "./types";
import { v4 as uuidv4 } from "uuid";

export default function Main() {
  const [isSidebarClosed, setCloseSidebar] = useState<boolean>(true);
  const SidebarContainerRef = useRef<HTMLDivElement>(null);
  const [isNewChat, setIsNewChat] = useState<boolean>(true);
  const [topics, setTopics] = useState<Array<TopicType>>([]);
  const [topicsLoading, setTopicsLoading] = useState<boolean>(false);
  const [activeTopicThread, setActiveTopicThread] =
    useState<Array<MessageType>>();
  const [lastActiveMessage, setLastActiveMessage] = useState<MessageType>();
  const [activeTopicId, setActiveTopicId] = useState<string>();
  /* Manages the prompt for textarea, higher up the component chain to facilitate 
  management of threads and parent messages */
  const [prompt, setPrompt] = useState<string>("");
  const [rv, refresh] = useState<number>(Math.random);
  console.log(activeTopicThread);

  // state managing userid
  const [userId, setUserId] = useState<string | null>(null);

  function startNewConv() {
    setActiveTopicThread(undefined);
    setLastActiveMessage(undefined);
    setActiveTopicId(undefined);
    setIsNewChat(false);
  }

  useEffect(() => {
    // fetch topics
    async function fetchTopics(userId: string) {
      try {
        setTopicsLoading(true);
        const { data, error } = await supabase
          .rpc("gettopics", {
            userid: userId,
          })
          .limit(20);
        if (error) {
          console.log(error);
        }
        setTopicsLoading(false);
        setTopics(data);
      } catch (error) {
        console.log(error);
        setTopicsLoading(false);
      }
    }

    // // userid
    // let storedUserId = localStorage.getItem("userId");

    // if (!storedUserId) {
    //   // If no UUID exists, generate a new one and store it
    //   const newUserId = uuidv4();
    //   localStorage.setItem("userId", newUserId);
    //   storedUserId = newUserId;
    // }
    // // Update the component state with the UUID
    setUserId(process.env.NEXT_PUBLIC_USER as string);

    // fetch topics with the userId gotten from local storage
    fetchTopics("73eab841-b700-41e5-91e7-fdbd531d0209");
  }, [rv]);

  const loadThread = async (topicId: string) => {
    try {
      const { data, error } = await supabase.rpc(
        "get_message_thread_by_topic",
        { topic_uuid: topicId },
        { count: "exact" }
      );
      if (error) {
        console.log(error);
      }
      setActiveTopicId(topicId);
      setIsNewChat(false);
      setActiveTopicThread(data);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleSidebar = () => {
    if (SidebarContainerRef.current !== null) {
      SidebarContainerRef.current.classList.toggle("toggleSidebar");
      setCloseSidebar((prevState) => {
        return !prevState;
      });
    }
  };
  return (
    <div className="flex">
      <Sidebar
        startNewConv={startNewConv}
        ref={SidebarContainerRef}
        topics={topics}
        toggleSidebar={toggleSidebar}
        loadThread={loadThread}
        topicsLoading={topicsLoading}
        activeTopicId={activeTopicId}
      />
      <div className="w-full">
        <main className="relative h-screen flex flex-col max-h-screen bg-zinc-900">
          <Topbar
            startNewConv={startNewConv}
            toggleSidebar={toggleSidebar}
            isSidebarClosed={isSidebarClosed}
          />
          <div className="flex px-4 flex-col relative justify-center w-full grow max-w-4xl mx-auto overflow-y-hidden">
            <Conversation
              loadThread={loadThread}
              refresh={refresh}
              data={activeTopicThread}
              activeTopicId={activeTopicId}
              setLastActiveMessage={setLastActiveMessage}
            />
            <PromptForm
              loadThread={loadThread}
              refresh={refresh}
              activeTopicId={activeTopicId}
              userId={userId}
              lastActiveMessage={lastActiveMessage}
              isNewChat={isNewChat}
              prompt={prompt}
              setPrompt={setPrompt}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
