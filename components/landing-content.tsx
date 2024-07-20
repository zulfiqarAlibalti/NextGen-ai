"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const testimonials = [
  {
    name: "Haider",
    avatar: "H",
    title: "Full Stack Developer",
    description:
      "I have been using Next Gen-AI for a while now and it has been a game changer for me. I can now generate code snippets and images in seconds. I highly recommend it to anyone who wants to save time and increase productivity.",
  },
  {
    name: "jaccob",
    avatar: "H",
    title: "Content Creator",
    description:
      "I create my audio and video content with Next Gen-AI. It has saved me a lot of time and effort. I can now focus on creating more content and growing my audience.",
  },
  
];

export const LandingContent = () => {
  return (
    <div className="px-10 pb-20">
      <h2 className="text-center text-4xl text-black font-extrabold mb-10">
        Testimonials
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {testimonials.map((item) => (
          <Card
            key={item.description}
            className="bg-[#ebeff7] border-none text-black"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-x-2">
                <div>
                  <p className="text-lg">{item.name}</p>
                  <p className="text-zinc-400 text-sm">{item.title}</p>
                </div>
              </CardTitle>
              <CardContent className="pt-4 px-0">
                <p>{item.description}</p>
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};
