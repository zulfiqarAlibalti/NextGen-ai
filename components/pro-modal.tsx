"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { useProModal } from "@/hooks/use-pro-modal";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Badge } from "@/components/ui/badge";
import { ArrowRight,
    Check,
    CodeIcon,
    ImageIcon,
     MessageSquare,
      Music,
      VideoIcon,
      Zap
      } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const tools = [
    {
      label: "Conversation",
      icon:MessageSquare,
      color:"text-violet-500",
      bgColor: "bg-violet-500/10",
      href: "/conversation"
    },
    {
      label: "Music Generation",
      icon:Music,
      color:"text-emerald-500",
      bgColor: "bg-emerald-500/10",
      href: "/music"
    },
    {
      label: "Image Generation",
      icon:ImageIcon,
      color:"text-pink-700",
      bgColor: "bg-pink-700/10",
      href: "/image"
    },
    {
      label: "Video Generation",
      icon:VideoIcon,
      color:"text-orange-700",
      bgColor: "bg-orange-700/10",
      href: "/video"
    },
    {
      label: "Code Generation",
      icon:CodeIcon,
      color:"text-yellow-500",
      bgColor: "bg-yellow-500/10",
      href: "/code"
    }
  ]

export const ProModal = () => {
    const proModal = useProModal();
    const [loading, setLoading] = useState(false);

    const onSubscribe = async () =>{
        try {
            setLoading(true);
            const response  = axios.get("/api/stripe");

            window.location.href = (await response).data.url;

        }catch (error) {
            toast.error("Something went wrong.");
        }
    }
    
    return (
        <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
                        <div className="flex items-center gap-x-2 font-bold py-1">
                            Upgrade Next Gen-AI to Pro
                            <Badge variant = "premium" className="uppercase text-sm py-1">
                                Pro
                            </Badge>
                        </div>
                    </DialogTitle>
                    <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
                        {tools.map((tool) => (
                            <Card
                            key={tool.label}
                            className="p-3 border-black/5 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-x-34">
                                    <div className={cn("p-2 w-fit rounded-md",tool.bgColor)}>
                                        <tool.icon className={cn("w-6 h-6", tool.color)}/>
                                    </div>
                                    <div className="font-semibold text-sm">
                                        {tool.label}
                                    </div>
                                </div>
                                <Check className="text-primary w-5 h-5"/>

                            </Card>

                        ))}

                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                    disabled={loading}
                    onClick={onSubscribe}
                    size = "lg"
                    variant="premium"
                    className="w-full"
                    >
                        Upgrade
                        <Zap className="w-4 h-4 ml-2 fill-white"/>

                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
