import type { MessageType } from "@/components/types";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const name = "fellowUser";

export default function sanitize(messages: Array<MessageType> | undefined) {
  if (!messages) {
    return [];
  }
  const sanitizeArr: Array<ChatCompletionMessageParam> = [];
  for (let i = 0; i < messages.length; i++) {
    const user = messages[0].prompt;
    const assistant = messages[0].message;
    sanitizeArr.push(
      { content: user, role: "user", name },
      { content: assistant, role: "assistant", name: "machine" }
    );
  }

  return sanitizeArr;
}
