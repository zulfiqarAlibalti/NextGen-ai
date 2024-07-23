"use client";

import axios from "axios";
import * as z from "zod";
import { Heading } from "@/components/heading";
import { VideoIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "./constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { useProModal } from "@/hooks/use-pro-modal";
import toast from "react-hot-toast";

const VideoPage = () => {
  const ProModal  = useProModal();
  const router = useRouter();
  const [video, setVideo] = useState<string>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setVideo(undefined);

      const response = await axios.post("/api/video", values);
      setVideo(response.data[0]);

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
        title="Video Generation"
        description="Play your favorite video with Next Gen AI."
        icon={VideoIcon}
        iconColor="text-orange-500"
        bgColor="bg-orange-500/10"
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
                      placeholder="Please type your video prompt here."
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
        {!video && !isLoading && (
          <div>
            <Empty label="No video generated." />
          </div>
        )}
        {video && (
          <video controls className="w-full aspect-video mt-8 rounded-lg border bg-black
          controls">
            <source src={video} />
          </video>
        )}
      </div>
    </div>
  );
};

export default VideoPage;
