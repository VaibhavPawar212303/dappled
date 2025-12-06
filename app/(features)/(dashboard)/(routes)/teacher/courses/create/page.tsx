"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


import { useRouter } from "next/navigation";
import Link from "next/link";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

import axios from "axios";
import toast from "react-hot-toast";



const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required",
    }),
});


const createCourse = () => {
    //@ts-ignore
    const router = useRouter();
    //@typescript-eslint/no-unused-vars
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    });
    const { isSubmitting, isValid } = form.formState;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post('/api/courses', values);
            router.push(`/teacher/courses/${response.data.id}`);
            toast.success('Course created successfully');
        } catch {
            toast.error('Something went wrong');
        }
    }

    return (
        <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
            <div>
                <h1 className="text-2xl">
                    Name your course
                </h1>
                <p className="text-sm text-slate-600">
                    Give your course a name. This will be the title of your course and will be visible to students.
                </p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Course Title
                                    </FormLabel>
                                    <FormControl>
                                        <Input disabled={isSubmitting}
                                            placeholder="e.g Manual Testing" {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        What will you going to teach in this course?
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Link href='/'>
                                <Button type="button" variant="ghost">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={!isValid || isSubmitting}>
                                Continue
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default createCourse;