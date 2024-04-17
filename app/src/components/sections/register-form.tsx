"use client";

import React, { useEffect, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Country, State, City } from "country-state-city";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import PhoneInput from "react-phone-number-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

type Props = {};

const formSchema = z
  .object({
    fullName: z.string().min(3).max(32),
    email: z.string().email("Please enter a vaild Email Address"),
    phoneNumber: z.string().trim(),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirm: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    country: z.string(),
    state: z.string(),
    city: z.string(),
    referredBy: z.string().optional(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"], // path of error
  });

const otpSchema = z.object({
  otp: z.string().min(6).max(6),
});

const phoneNumberSchema = z.object({
  phoneNumber: z.string().trim(),
});

export default function RegisterForm({}: Props) {
  // Wizard state
  const [step, setStep] = useState("phone");
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [otpDisable, setOtpDisable] = useState(true);
  // Main Form select list data
  const [countries, setCountries] = useState<Array<any>>([]);
  const [states, setStates] = useState<Array<any>>([]);
  const [cities, setCities] = useState<Array<any>>([]);
  // Navigation
  const router = useRouter();
  const searchParams = useSearchParams();
  // Erorr
  const [error, setErorr] = useState<any>(null);

  // Forms
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "IN",
    },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
  });

  const phoneNumberForm = useForm<z.infer<typeof phoneNumberSchema>>({
    resolver: zodResolver(phoneNumberSchema),
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const referredBy: string | null = searchParams.get("ref");
    if (referredBy) {
      data = { ...data, referredBy };
    }
    const result = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => {
        const data = res.json();
        if (res.status === 200) router.push("/login");
        else setErorr(data);
        return;
      })
      .catch((err) => {
        console.log(err);
        setErorr(err);
      });
  }

  async function otpSubmit(data: z.infer<typeof otpSchema>) {
    const result = await fetch("/api/otp", {
      method: "POST",
      body: JSON.stringify({
        phoneNumber: form.watch("phoneNumber"),
        otp: data.otp,
      }),
    })
      .then((res) => {
        const data = res.json();
        if (res.status === 200) {
          toast({
            description: (
              <pre className="mt-2 w-[340px] rounded-md bg-green-900 p-4">
                <code className="text-white">OTP verified</code>
              </pre>
            ),
          });
          setStep("register");
        } else {
          toast({
            description: (
              <pre className="mt-2 w-[340px] rounded-md bg-red-900 p-4">
                <code className="text-white">OTP Verification Failed</code>
              </pre>
            ),
          });
        }
      })
      .catch((err) => {
        console.error(err);
        toast({
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-red-900 p-4">
              <code className="text-white">Failed to Verify OTP</code>
            </pre>
          ),
        });
      });
  }

  async function phoneNumberSubmit(data: z.infer<typeof phoneNumberSchema>) {
    setPhoneLoading(true);
    const result = await fetch("/api/otp", {
      method: "PUT",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((err) => {
        console.error(err);
        setPhoneLoading(false);
      });
    if (result?.getOtp === "OTP Sent Successfully") {
      form.setValue("phoneNumber", data.phoneNumber);
      setStep("otp");
    }
  }

  useEffect(() => {
    const getCountries = async () => {
      try {
        const result = await Country.getAllCountries();
        setCountries(
          result?.map(({ isoCode, name }) => ({
            isoCode,
            name,
          }))
        );
      } catch (error) {
        setCountries([]);
      }
    };
    getCountries();
  }, []);

  useEffect(() => {
    const getStates = async () => {
      try {
        const result = await State.getStatesOfCountry(form.watch("country"));
        setStates(
          result?.map(({ isoCode, name }) => ({
            isoCode,
            name,
          }))
        );
      } catch (error) {
        setStates([]);
      }
    };
    getStates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("country")]);

  useEffect(() => {
    // get cities
    const getCities = async () => {
      try {
        const result = await City.getCitiesOfState(
          form.watch("country"),
          form.watch("state")
        );
        setCities(result?.map(({ name }) => ({ name })));
      } catch (error) {
        setCities([]);
      }
    };
    getCities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("state")]);

  return (
    <Tabs value={step}>
      <TabsContent value="phone">
        <div className="flex flex-col gap-4">
          <Form {...phoneNumberForm}>
            <form
              onSubmit={phoneNumberForm.handleSubmit(phoneNumberSubmit)}
              className="space-y-2"
            >
              <FormField
                control={phoneNumberForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-gray-700">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <PhoneInput
                        placeholder="Enter phone number"
                        defaultCountry="IN"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Phone Number will be used to log on to Pramey Shala.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button disabled={phoneLoading} type="submit">
                  {phoneLoading ? (
                    <ReloadIcon className="animate-spin" />
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <p className="font-bold">{phoneNumberForm.watch("phoneNumber")}</p>
        </div>
      </TabsContent>
      <TabsContent value="otp">
        <div className="flex flex-col">
          <Form {...otpForm}>
            <form
              onSubmit={otpForm.handleSubmit(otpSubmit)}
              className="space-y-2"
            >
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-gray-700">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter OTP"
                        autoFocus
                        {...field}
                        min={6}
                        max={6}
                        onChange={(event) => {
                          event.target.value.length === 6
                            ? setOtpDisable(false)
                            : setOtpDisable(true);
                          field.onChange(event);
                        }}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Phone Number will be used to log on to Pramey Shala.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={otpDisable}>
                Verify Number
              </Button>
            </form>
          </Form>
        </div>
      </TabsContent>
      <TabsContent value="register">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 space-y-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="font-medium text-gray-700">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Mirnalika Rai" autoFocus {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-gray-700">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example@prameyshala.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Verfication and Password Reset will be sent to this email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-gray-700">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="*********"
                        autoComplete="new-password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-gray-700">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="*********"
                        autoComplete="confirm-password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-gray-700">
                      Country
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        {...field}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Your Country" />
                        </SelectTrigger>
                        <SelectContent className="overflow-y-auto max-h-96">
                          {countries.map(({ isoCode, name }) => (
                            <SelectItem value={isoCode} key={isoCode}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-gray-700">
                      State
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        {...field}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Your State" />
                        </SelectTrigger>
                        <SelectContent className="overflow-y-auto max-h-96">
                          {states.map(({ isoCode, name }) => (
                            <SelectItem value={isoCode} key={isoCode}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-gray-700">
                      City
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        {...field}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Your City" />
                        </SelectTrigger>
                        <SelectContent className="overflow-y-auto max-h-96">
                          {cities.map(({ name }) => (
                            <SelectItem value={name} key={name}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign up
              </button>
            </div>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  );
}
