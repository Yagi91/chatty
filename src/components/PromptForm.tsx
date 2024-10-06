import React, {
  useEffect,
  useState,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";

export default function PromptForm({
  isNewChat,
  prompt,
  setPrompt,
}: {
  isNewChat: boolean;
  prompt: string;
  setPrompt: Dispatch<SetStateAction<string>>;
}) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const kbdElem = textAreaRef.current;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (kbdElem) {
        if (e.key === "Enter" && !e.shiftKey && kbdElem.form) {
          e.preventDefault();
          kbdElem.form.submit();
        }
      }
    };

    textAreaRef.current?.addEventListener("keydown", handleKeyDown);
    return () =>
      textAreaRef.current?.removeEventListener("keydown", handleKeyDown);
  }, []);

  async function submitPrompt(): Promise<void> {
    if (!prompt) {
    } else {
      (await 2) + 2;
    }
  }

  function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (e.target.value) {
      setPrompt(e.target.value);
    }
  }

  function StarterDesktop() {
    if (!isNewChat) {
      return null;
    }

    return (
      <div className="hidden md:flex w-full gap-2">
        <div className="flex gap-2 p-2">
          <span></span>
          <p className="text-sm">Create Image</p>
        </div>{" "}
        <div className="flex gap-2 p-2">
          <span></span>
          <p className="text-sm">Help me write</p>
        </div>
        <div className="flex gap-2 p-2">
          <span></span>
          <p className="text-sm">Analyze images</p>
        </div>
        <div className="flex gap-2 p-2">
          <span></span>
          <p className="text-sm">Brainstorm</p>
        </div>
      </div>
    );
  }

  function StarterMobile() {
    if (!isNewChat) {
      return null;
    } else {
      return (
        <div className="lg:hidden gap-2 flex flex-col justify-center align-middle">
          <span>{/* OpenAI icon */}</span>
          <div className="grid gap-4 grid-cols-2 justify-items-center align-middle">
            <div className="rounded-2xl">
              <span></span>
              <p className="text-sm">Create an illustration for a bakery</p>
            </div>
            <div className="rounded-2xl">
              <span></span>
              <p className="text-sm">What can ChatGPT do</p>
            </div>
            <div className="hidden sm:block rounded-2xl">
              <span></span>
              <p className="text-sm">Create a chart based on my data</p>
            </div>
            <div className="hidden sm:block rounded-2xl">
              <span></span>
              <p className="text-sm">Make me a personal webpage</p>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <form
      onSubmit={submitPrompt}
      className={
        !isNewChat ? "absolute w-full left-0 bottom-0 px-4" : "justify-center"
      }
    >
      <div className={!isNewChat ? "max-w-4xl mx-auto" : ""}>
        <div className="flex justify-between flex-col">
          <StarterMobile />
          <div className="space-y-4">
            {!isNewChat ? null : (
              <h2 className="hidden lg:block text-center">
                Where should we start?
              </h2>
            )}
            <div className="relative">
              <div className="absolute">
                <div className="absolute left-2 top-1 text-sm">
                  <button
                    type="submit"
                    className="text-zinc-300 rounded-full border-0 bg-transparent p-3"
                  >
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
              <div>
                <textarea
                  onChange={handleTextChange}
                  ref={textAreaRef}
                  rows={1}
                  className="block bg-zinc-800 text-zinc-300 placeholder:text-zinc-400 px-16 py-4 rounded-full w-full"
                  placeholder="Message Chatty"
                ></textarea>
              </div>
              <div className="absolute right-2 top-1 text-sm">
                <button
                  type="submit"
                  className="text-zinc-50 rounded-full border-0 bg-slate-700 p-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <StarterDesktop />
          </div>
        </div>
      </div>
    </form>
  );
}
