"use client";

import ErrorMessage from "./ErrorMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "../_components/Toast";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Loading from "@/app/_components/Loading";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export default function InputForm() {
  const [isLoading, setLoading] = useState(false);
  const { toast, showToast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true);
      const result = await signIn("credentials", {
        redirect: false,
        username: data.username,
        password: data.password,
        callbackUrl: "/admin/projects",
      });

      if (result?.error) {
        setLoading(false);
        showToast("Login failed: Invalid credentials", "error");
      }

      if (result?.url) {
        window.location.href = result.url;
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Login failed:", error);
      showToast("An unexpected error occurred", "error");
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full">
        <Loading />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="type ur username" {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="ur passsword" {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <ErrorMessage />
        <Button
          type="submit"
          className="hover:cursor-pointer bg-black text-white ">
          Login
        </Button>
      </form>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </Form>
  );
}





