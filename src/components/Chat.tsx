"use client";

import { useState, useEffect } from "react";

import PromptInput from "./PromptInput";
import Sidebar from "./Sidebar";
import type { MessageType, TopicType, VersionType } from "./types";
import type { ChatModel } from "openai/resources/index.mjs";
import { supabase } from "@/lib/supabaseClient";
import { openai } from "@/lib/openAIClient";
import sanitize from "@/utils/sanitizeResponse";
import Conversations from "./Conversations";
import Header from "./Header";

export default function Chat() {
  const [topics, setTopics] = useState<Array<TopicType>>([]);
  const [model, setModel] = useState<ChatModel>("gpt-3.5-turbo");
  const [currentVersion, setCurrentVersion] = useState<VersionType>();
  const [messages, setMessages] = useState<Array<MessageType>>([]);
  const [respLoading, setRespLoading] = useState<boolean>(false);
  const [msgLoading, setMsgLoading] = useState<boolean>(false);
  const [topicLoading, setTopicLoading] = useState<boolean>(false);
  const [error, setError] = useState<{ error: boolean; body?: unknown }>({
    error: false,
  });

  function handleEdit(prompt: string, versionId: string) {
    // call open ai with the last 4 conversations both machine and client plus the the incoming prompt
    if (messages) {
    }
    openai.chat.completions
      .create({
        messages: sanitize(messages),
        model,
      })
      .then(async (d) => {
        const { data, error } = await supabase.rpc("editMessage", {
          versionId: currentVersion?.id,
          message: d,
        });
        if (error) {
          console.log("error getting result");
        } else {
          // update the particular topic for this version and set the version to the currentVersion
          setTopics((prevState) => {
            if (topics && prevState) {
              const updatedTopic = prevState?.find(
                (topic) => topic?.id === data.version.id
              );
              updatedTopic?.versions.push(data);
              const updatedTopics = topics.filter(
                (topic) => topic?.id === data.version.id
              );
              if (updatedTopic) {
                updatedTopics.push(updatedTopic);
              }
              return updatedTopics;
            } else {
              return [];
            }
          });
          setCurrentVersion(data);
        }
      })
      .catch((error) => {
        console.log(error, "error getting result");
      });
  }

  async function handleMessageAdd({
    prompt,
    versionId,
  }: {
    prompt: string;
    versionId?: string;
  }) {
    if (!versionId) {
      // No versionId means
      try {
        openai.chat.completions
          .create({
            messages: [{ content: prompt, role: "user" }],
            model,
          })
          .then(async (d) => {
            console.log(d);
            const { data, error } = await supabase.rpc("startConvo", {
              message: d,
              userId: "userId gotten from localStorage",
            });
          })
          // update state here if now error exists
          .catch((error) => {
            console.log(error, "error getting result");
          });
      } catch (e) {
        setError({ error: true, body: e });
      }
    } else {
      // If version Id exists then we continue a conversation
      // Fetch last four exchanges with openApi and submit alongside new message/prompt
      try {
        openai.chat.completions
          .create({
            messages: [
              ...sanitize(messages.slice(-2)),
              { content: prompt, role: "user" },
            ],
            model,
          })
          .then(async (d) => {
            console.log(d);
            const { data, error } = await supabase.rpc("addMessage", {
              versionId: currentVersion?.id,
              message: d,
              userId: "userId gotten from localStorage",
            });
            // update state here with data to reflect backend
          })
          .catch((error) => {
            console.log(error, "error getting result");
          });
      } catch (e) {
        setError({ error: true, body: e });
      }
    }
  }

  useEffect(() => {
    async function getTopics(): Promise<void> {
      //limits sidebar topics to 10 messages
      try {
        setTopicLoading(true);
        const { data } = await supabase
          .rpc("getTopics", { user: "userId gotten from localStorage" })
          .limit(10);

        setTopics(data);
        setTopicLoading(false);
      } catch (e) {
        setTopicLoading(false);
        setError({ error: true, body: e });
        console.log(e);
      }

      // return rpc topics
    }
    getTopics();
  }, [topics]);

  useEffect(() => {
    async function getMessages(): Promise<void> {
      // Gets all the messages from a given version
      try {
        setMsgLoading(true);

        const { data } = await supabase
          .rpc("getMessages", { versionId: currentVersion })
          .limit(10);

        setMessages(data);
        setMsgLoading(false);
      } catch (e) {
        setMsgLoading(false);

        setError({ error: false, body: e });
        console.log(e);
      }
    }
    getMessages();
  }, [currentVersion]);

  return (
    <div className="grid grid-cols-7">
      <div className="col-span-7">
        <Header />
      </div>
      <div className="col-span-2">
        <Sidebar
          loading={topicLoading}
          topics={topics}
          setVersion={setCurrentVersion}
        />
      </div>
      <div className="col-span-5">
        <Conversations
          loading={msgLoading}
          rspLoading={respLoading}
          messages={messages}
          version={currentVersion as VersionType}
          handleEdit={handleEdit}
        />
        <PromptInput
          versionId={currentVersion?.id as string}
          handleMessageAdd={handleMessageAdd}
        />
      </div>
    </div>
  );
}
