"use client";
import { useState, ChangeEvent, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import toast from "react-hot-toast";
import Image from "next/image";

const App: React.FC = () => {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;
  const [output, setOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileURL, setFileURL] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [output]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      const validTypes = ["image/png", "image/jpg", "image/jpeg"];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error("Please upload image only");
        return;
      }
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
    if (!file) {
      toast.error("Please upload your resume");
      return;
    }
    setIsLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = await genAI.getGenerativeModel({ model: "gemini-pro-vision" });
      const prompt = "analyse my resume and rate it out of 100 and also give suggestions if any";
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
        Brief Resume analysis using
        <h1 className="text-3xl text-black font-bold inline"><span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"> ai</span>.CVscan</h1>
      </div>

      <div className="w-full h-fit flex flex-col items-center gap-5 justify-center">
        {/* input */}
        <div className="border-2 md:w-[70%] w-full flex flex-col gap-3 items-center justify-center border-dotted rounded-md shadow p-3 bg-gray-50">
          <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">PNG or JPG (MAX. 800x400px)</p>
              </div>
              <input onChange={handleFileChange} id="dropzone-file" type="file" className="hidden" />
            </label>
          </div>
          {file && <p className="text-sm text-red-600">File: {file.name}</p>}
          <span className="text-sm text-slate-400">Note: AI can make mistakes</span>
          <button
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold shadow-md hover:shadow-lg px-4 py-2 rounded-md"
            onClick={handleRun}
            disabled={isLoading}
          >
            {isLoading ? "Analysing..." : "Run"}
          </button>
        </div>
        {/* output */}
        {
          output
          &&
          <div className="flex items-center flex-wrap md:flex-nowrap mt-8 justify-center gap-4">
            {fileURL && <Image src={fileURL} alt="Uploaded" width="400" height={300} />}
            <div className="border-2 bg-gray-50 overflow-auto w-full min-h-80 border-dotted rounded-md shadow p-4">
              <pre ref={ref} className="whitespace-pre-line text-justify">{output}</pre>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default App;