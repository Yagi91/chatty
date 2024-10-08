export type TopicType = {
  id: string, 
  created_at: string,
  title:string,
};

export type MessageType = {
  message_id: string;
  prompt: string;
  message: string;
  created_at: string;
  children: Array<MessageType>;
};