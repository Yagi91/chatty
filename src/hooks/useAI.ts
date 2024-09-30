import { useEffect, useState } from "react";
import OpenAI from "openai";
import { AIModel } from "@/components/types";
import type { ChatCompletion } from "openai/resources/index.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

type MessageType = {
  role: string;
  content: string | null;
  name: string;
};

export default function useAI(messages: Array<MessageType>, model: AIModel) {
  const [data, setData] = useState<ChatCompletion>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function main() {
      setLoading(true);
      openai.chat.completions
        .create({
          messages,
          model,
        })
        .then((data) => setData(data))
        .catch((error) => {
          setError(error);
        });
    }
    main();
  });
  return [loading, data, error];
}
