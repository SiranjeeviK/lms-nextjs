"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseEnrollButtonProps {
  courseId: string;
  price: number;
}

const CourseEnrollButton = ({ courseId, price }: CourseEnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const onClick = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`/api/courses/${courseId}/checkout`);
      window.location.assign(response.data.url);
    } catch (error) {
      toast.error("Something went wrong.");
      console.log("[CourseEnrollButton]", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      size={"sm"}
      className="w-full md:w-auto"
      onClick={onClick}
      disabled={isLoading}
    >
      Enroll for {formatPrice(price)}
    </Button>
  );
};

export default CourseEnrollButton;
