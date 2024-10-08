import { MessageType } from "@/components/types";
import { openai } from "@/lib/openAIClient";
import { supabase } from "@/lib/supabaseClient";

export async function addExchange(
  prompt: string,
  userId: string,
  topicId?: string,
  lastMessage?: MessageType
) {
  if (lastMessage && topicId) {
    try {
      let completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "user", content: lastMessage.prompt },
          { role: "assistant", content: lastMessage.message },
          { role: "user", content: prompt },
        ],
      });
      completion.choices;
      const { data, error } = await supabase.rpc("add_exchange", {
        parent_id: lastMessage.message_id,
        prompt,
        topic_id: topicId,
        response: completion.choices[0].message,
      });
      if (error) {
        throw error;
      }
      //
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      let completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      });
      completion.choices;
      const { data, error } = await supabase.rpc("start_convo", {
        prompt,
        response: completion.choices[0].message,
        user_id: userId,
      });
      if (error) {
        throw error;
      }
      //
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }
}
export async function editMessage(
  edit: string,
  promptId: string,
  topicId: string
) {
  try {
    let completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: edit }],
    });
    completion.choices;
    const { data, error } = await supabase.rpc("edit_message", {
      prompt,
      response: completion.choices[0].message,
      sibling_id: promptId,
      topic_id: topicId,
    });
    if (error) {
      throw error;
    }
    //
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}
