"use client";

import React, { useState } from "react";
import { Label } from "../ui/label";
import PhoneInput from "react-phone-number-input";
import { Button } from "../ui/button";
import Link from "next/link";

type Props = {};

export default function SetupOtp({}: Props) {
  const [phoneNumber, setPhoneNumber] = useState<any>();
  return (
    <div className="md:text-xl py-1 max-w-sm">
      <div className="mb-3">
        <Label className=" text-background">Enter your mobile number</Label>
        <PhoneInput
          placeholder="Enter phone number"
          defaultCountry="IN"
          value={phoneNumber}
          onChange={setPhoneNumber}
        />
      </div>
      <div className="flex py-2">
        <Button variant={"white"} className="text-xs md:text-lg">
          Join
        </Button>
        <Link passHref href="/about">
          <Button
            variant={"ghost"}
            className="mx-2 text-white text-xs md:text-sm"
          >
            Find Out More
          </Button>
        </Link>
      </div>
    </div>
  );
}
