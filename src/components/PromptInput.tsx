import { useState } from "react";

export default function PromptInput({
  handleMessageAdd,
  versionId,
}: {
  versionId?: string;
  handleMessageAdd: ({
    versionId,
    prompt,
  }: {
    versionId?: string;
    prompt: string;
  }) => void;
}) {
  const [prompt, setPrompt] = useState("");
  return (
    <div className="absolute bottom-4 left-0 w-screen p-4">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          handleMessageAdd({ versionId, prompt });
        }}
      >
        <div className="w-full grid grid-cols-8 items-center gap-4">
          <div className="col-span-7">
            <textarea
              className="textarea textarea-primary m-0 w-full"
              placeholder="What will you like to do today"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            ></textarea>
          </div>
          <div className='col-span-1'>
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={!prompt}
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
