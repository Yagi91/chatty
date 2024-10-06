import PromptForm from "./PromptForm";
import Topbar from "./Topbar";
import Conversation from "./Conversation";
import Sidebar from "./Sidebar";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { TopicType } from "./types";

export default function Main() {
  const [isSidebarClosed, setCloseSidebar] = useState<boolean>(true);
  const SidebarContainerRef = useRef<HTMLDivElement>(null);
  const [isNewChat, setIsNewChat] = useState<boolean>(true);
  const [topics, setTopics] = useState<Array<TopicType>>([]);
  const [topicsLoading, setTopicsLoading] = useState<boolean>(false);

  /* Maintains the current active chatId in the conversation panel, with navigations on the side to support
  across siblings. On change a useEffect shoudl fire to update the conversation panel */
  const [activeChatId, setActiveChatId] = useState<{}>({});

  /* Manages the prompt for textarea, higher up the component chain to facilitate 
  management of threads and parent messages */
  const [prompt, setPrompt] = useState<string>("");

  // Parents are the parent messages used to populate the sidebar
  // They are passed into categorize in the sidebar component to categorize them according to date
  const [parents, setParents] = useState<Array<string>>([]);

  useEffect(() => {
    //Fetch the active chat
  }, [activeChatId]);

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
    fetchTopics("73eab841-b700-41e5-91e7-fdbd531d0209");
  }, []);

  const loadThread = async (topicId: string) => {
    try {
      const { data, error } = await supabase.rpc(
        "get_message_thread_by_topic",
        { topic_uuid: topicId }
      );
      console.log(data);
      setIsNewChat(false);
    } catch (error) {
      console.log(error);
    }
  };

  const addExchange = () => {
    // Adds a prompt-exchange to conversation view
    // Onsuccess should remove the new Chat view
    setIsNewChat(false);
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
        ref={SidebarContainerRef}
        topics={topics}
        toggleSidebar={toggleSidebar}
        loadThread={loadThread}
        topicsLoading={topicsLoading}
      />
      <div className="w-full">
        <main className="relative h-screen flex flex-col max-h-screen bg-zinc-900 px-6">
          <Topbar
            toggleSidebar={toggleSidebar}
            isSidebarClosed={isSidebarClosed}
          />
          <div className="flex px-4 flex-col relative  justify-center w-full grow max-w-4xl mx-auto overflow-y-scroll">
            <Conversation />
            <PromptForm
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
