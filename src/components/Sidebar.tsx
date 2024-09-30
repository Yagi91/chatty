import { Dispatch, SetStateAction } from "react";
import { TopicType, VersionType } from "./types";

export default function Sidebar({
  topics,
  setVersion,
  loading,
}: {
  loading: boolean;
  setVersion: Dispatch<SetStateAction<VersionType | undefined>>;
  topics: Array<TopicType>;
}) {
  function handleVersion(topic: TopicType) {
    if (topic.versions.length == 1) {
      setVersion(topic.versions[0]);
    } else {
      return null;
    }
  }
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!topics?.length || topics == null) {
    return <p>No History of conversations</p>;
  }

  return (
    <div className="border bottom-1 border-primary p-4">
      {topics?.map((topic: TopicType) => {
        return (
          <div key={topic.id}>
            <div onClick={() => handleVersion(topic)}>{topic.title}</div>
            <div>
              <ul>
                {topic.versions.map((version: VersionType) => {
                  return (
                    <li onClick={() => setVersion(version)} key={version.id}>
                      {version.title}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}
