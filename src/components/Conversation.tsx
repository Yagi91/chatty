import { useState, useRef } from "react";

export default function Conversation() {
  return (
    <div className="space-y-10">
      <PromptBody message="Hello" id="11" />
      <ResponseBody response="Hi" />
    </div>
  );
}

function ResponseBody({ response }: { response: string }) {
  return (
    <div className="relative">
      <div>
        <p>
          DRM-free refers to digital content that is distributed without Digital
          Rights Management (DRM) technology. DRM is a set of access control
          technologies that are used to restrict the ways in which digital
          content can be used, copied, or shared. Here are a few key points
          about DRM-free content:
        </p>
      </div>
      <div className="abos"></div>
    </div>
  );
}

function PromptBody({ message, id }: { message: string; id: string }) {
  const [edit, setEdit] = useState(false);
  const [update, handleChange] = useState<string>(message);

  const editButtonRef = useRef<HTMLButtonElement>(null);

  if (edit) {
    return (
      <div className="relative">
        <textarea
          rows={3}
          className="block bg-zinc-700 rounded-3xl text-zinc-300 placeholder:text-zinc-400 px-8 pt-4 pb-14 w-full"
          value={update}
          onChange={(e) => handleChange(e.target.value)}
        ></textarea>
        <div className="flex justify-end absolute inset-x-0 gap-4 bottom-4 px-4">
          <button
            className="border-0 py-2 px-4 rounded-full transition-colors ease-in-out duration-300 bg-zinc-900 hover:bg-zinc-950"
            type="button"
            onClick={() => setEdit(false)}
          >
            Cancel
          </button>
          <button
            className="border-0 py-2 px-4 rounded-full transition-colors ease-in-out duration-300 bg-zinc-100 hover:bg-zinc-200 text-zinc-900"
            type="button"
          >
            Send
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div
        onMouseOver={() => editButtonRef.current?.classList.toggle("opacity-0")}
        onMouseOut={() => editButtonRef.current?.classList.toggle("opacity-0")}
        className="w-full flex justify-end"
      >
        <div className="bg-zinc-800 px-6 py-2 cursor-text relative rounded-3xl">
          <button
            ref={editButtonRef}
            onClick={() => setEdit(true)}
            className="opacity-0 absolute rounded-full p-2 -left-10 top-1 max-h6 my-auto hover:bg-zinc-700 transition"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M13.2929 4.29291C15.0641 2.52167 17.9359 2.52167 19.7071 4.2929C21.4784 6.06414 21.4784 8.93588 19.7071 10.7071L18.7073 11.7069L11.6135 18.8007C10.8766 19.5376 9.92793 20.0258 8.89999 20.1971L4.16441 20.9864C3.84585 21.0395 3.52127 20.9355 3.29291 20.7071C3.06454 20.4788 2.96053 20.1542 3.01362 19.8356L3.80288 15.1C3.9742 14.0721 4.46243 13.1234 5.19932 12.3865L13.2929 4.29291ZM13 7.41422L6.61353 13.8007C6.1714 14.2428 5.87846 14.8121 5.77567 15.4288L5.21656 18.7835L8.57119 18.2244C9.18795 18.1216 9.75719 17.8286 10.1993 17.3865L16.5858 11L13 7.41422ZM18 9.5858L14.4142 6.00001L14.7071 5.70712C15.6973 4.71693 17.3027 4.71693 18.2929 5.70712C19.2831 6.69731 19.2831 8.30272 18.2929 9.29291L18 9.5858Z"
                fill="currentColor"
              ></path>
            </svg>
          </button>
          {message}
        </div>
      </div>
    );
  }
}
