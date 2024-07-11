"use client";

import axios from "axios";
import * as z from "zod";
import { Heading } from "@/components/heading";
import { CodeIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "./constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ChatCompletionRequestMessage } from "openai";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import { useProModal } from "@/hooks/use-pro-modal"; 
import toast from "react-hot-toast";

const CodePage = () => {
  const ProModal = useProModal();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatCompletionRequestMessage = {
        role: "user",
        content: values.prompt,
      };
      const newMessages = [...messages, userMessage];

      const response = await axios.post("/api/code", {
        messages: newMessages,
      });

      setMessages((current) => [...current, userMessage, response.data]);

      form.reset();
    } catch (error: any) {
      if (error.response?.status === 403) {
        ProModal.onOpen();
      }else {
        toast.error("Somthing went wrong.")
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
            <Button
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
