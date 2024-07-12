"use client";
import { useState, ChangeEvent } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import toast from "react-hot-toast";
import Spinner from "@/components/Spinner";
import Image from "next/image";

const App: React.FC = () => {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;
  const [output, setOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [Prompt, setPrompt] = useState<string>("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
      setFileURL(URL.createObjectURL(selectedFile));
    }
  };

  const fileToGenerativePart = (file: string, mimeType: string) => {
    return {
      inlineData: {
        data: file,
        mimeType,
      },
    };
  };

  const handleRun = async () => {
    if (!Prompt || !file) {
      toast.error("Please enter all fields");
      return;
    }
    setIsLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = await genAI.getGenerativeModel({ model: "gemini-pro-vision" });

      const prompt = Prompt;
      const mimeType = file.type;
      const imagePart = fileToGenerativePart(await readFileAsBase64(file), mimeType);

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = await response.text();
      setOutput(text);
    } catch (error) {
      toast.error("An error occurred, try Again");
    } finally {
      setIsLoading(false);
    }
  };

  const readFileAsBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="w-full h-fit flex items-center flex-col gap-5 justify-center p-8">
      {/* heading */}
      <div className="mx-auto text-center pb-2 font-bold text-slate-400 md:text-3xl">
        Analyse Resume using
        <h1 className="text-3xl text-black font-bold inline"> resume.<span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">ai</span></h1>
      </div>
      <div className="w-full h-fit flex flex-wrap md:flex-nowrap items-center gap-5 justify-center">
        {/* input */}
        <div className="border-2 md:w-[70%] w-full flex flex-col gap-3 items-center justify-center border-dotted rounded-md shadow p-3 bg-gray-50">
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-4 p-2"
            type="file"
            onChange={handleFileChange}
          />
          
          {fileURL && <Image src={fileURL} alt="Uploaded" width="200" height={300} />}
          <textarea
            className="w-full max-h-80 border p-2 rounded-md"
            value={Prompt}
            placeholder="Your question?"
            rows={5}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <span className="text-sm text-slate-400">Note: AI can make mistakes</span>
          <button
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold shadow-md hover:shadow-lg px-4 py-2 rounded-md"
            onClick={handleRun}
            disabled={isLoading}
          >
            {isLoading ? "Finding..." : "Run"}
          </button>
        </div>
        {/* output */}
        {isLoading ? (
          <div className="border-2 bg-gray-50 w-full min-h-80 flex items-center justify-center border-dotted rounded-md shadow p-3">
            <Spinner />
          </div>
        ) : (
          <div className="border-2 bg-gray-50 overflow-auto w-full min-h-80 border-dotted rounded-md shadow p-4">
            <pre className="whitespace-pre-line text-justify">{output}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;