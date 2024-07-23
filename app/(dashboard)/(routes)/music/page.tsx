"use client";

import axios from "axios";
import * as z from "zod";
import { Heading } from "@/components/heading";
import { MusicIcon } from "lucide-react";
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

const MusicPage = () => {
  const ProModal = useProModal();
  const router = useRouter();
  const [music, setMusic] = useState<string>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setMusic(undefined);

      const response = await axios.post("/api/music", values);
      setMusic(response.data.audio);

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
        title="Music Generation"
        description="Listen your favorite music with Next Gen AI."
        icon={MusicIcon}
        iconColor="text-emerald-500"
        bgColor="bg-emerald-500/10"
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
                      placeholder="Please type your music request here."
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
        {!music && !isLoading && (
          <div>
            <Empty label="No music generated." />
          </div>
        )}
        {music && (
          <audio controls className="w-full mt-8">
            <source src={music} />
          </audio>
        )}
      </div>
    </div>
  );
};

export default MusicPage;
