"use client";

import axios from "axios";
import * as z from "zod";
import { Heading } from "@/components/heading";
import { CodeIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formSchema } from "./constants";
import {Empty} from "@/components/empty";
import { Loader } from "@/components/loader";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import { useProModal } from "@/hooks/use-pro-modal"; 
import toast from "react-hot-toast";

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const CodePage = () => {
  const ProModal = useProModal();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: Message = {
        role: "user",
        content: values.prompt,
      };
      const newMessages = [...messages, userMessage];

      const response = await axios.post("/api/code", {
        messages: newMessages,
      });

      const assistantMessage = response.data;

      setMessages((current) => [...current, userMessage, assistantMessage]);
      toast.success("Code generated successfully!");

      form.reset();
    } catch (error) {
      // TypeScript needs to understand the shape of the error
      if (axios.isAxiosError(error)) {
        // Handle errors from axios specifically
        if (error.response?.status === 403) {
          ProModal.onOpen();
        } else {
          toast.error("Something went wrong.");
        }
      } else {
        // Handle other types of errors
        toast.error("An unexpected error occurred.");
      }
    } finally {
      router.refresh();
    }
  };

  return (
    <div className="p-4 lg:p-8">
      <Heading
        title="Code Generation"
        description="Generate code snippets with Next-Gen AI."
        icon={CodeIcon}
        iconColor="text-yellow-700"
        bgColor="bg-yellow-700/10"
      />
      <div className="px-4 lg:px-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="
              rounded-lg
              border
              w-full
              p-4
              focus-within:shadow-sm
              grid
              grid-cols-1
              gap-2
              md:grid-cols-12
            "
          >
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem className="col-span-12 md:col-span-10">
                  <FormControl className="m-0 p-0">
                    <Input
                      className="
                        border-0
                        outline-none
                        focus-visible:ring-0
                        focus-visible:ring-transparent
                      "
                      disabled={isLoading}
                      placeholder="Prompt for code generation"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button variant="premium"
              className="col-span-12 md:col-span-2 w-full"
              disabled={isLoading}
            >
              Generate
            </Button>
          </form>
        </Form>
      </div>
      <div className="space-y-4 mt-4">
        {isLoading && (
          <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
            <Loader />
          </div>
        )}
        {messages.length === 0 && !isLoading && (
          <div>
            <Empty label="No conversation started." />
          </div>
        )}
        <div className="flex flex-col-reverse space-y-4 space-y-reverse">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "p-4 w-full flex items-start gap-x-4 rounded-lg",
                message.role === "user"
                  ? "bg-white border border-black/10"
                  : "bg-muted"
              )}
            >
              {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
              <ReactMarkdown
                className="prose w-full break-words"
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {message.content || ""}
              </ReactMarkdown>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodePage;
