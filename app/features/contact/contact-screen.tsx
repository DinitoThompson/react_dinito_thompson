"use client";

import React, { useState, useEffect } from "react";
import { Send, Mail, Phone, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Link } from "next-view-transitions";
import { BubblesBackground } from "@/app/components/animated-background/bubbles-animated-bg";

export default function ContactScreen() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canSendEmail, setCanSendEmail] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanSendEmail(true);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.message.trim()) errors.message = "Message is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSendEmail) {
      toast({
        title: "Rate Limit Exceeded",
        description: `Please wait ${countdown} seconds before sending another message.`,
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Message Sent!",
          description: "Thank you for reaching out. I'll get back to you soon.",
        });
        setCanSendEmail(false);
        setCountdown(60);
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error(result.error || "Failed to send email");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="contact"
      className="min-h-screen text-white relative overflow-hidden"
    >
      <BubblesBackground />
      <div className="min-h-screen flex flex-col justify-center p-10 sm:p-6 md:p-8 lg:p-16 relative overflow-hidden">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl py-10 sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-teal-500"
        >
          Let&apos;s Connect
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-800/30 backdrop-blur-md rounded-lg shadow-2xl overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-2/5 bg-gradient-to-br from-blue-900/50 to-purple-900/50 p-6 sm:p-8 lg:p-12">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
                Get in Touch
              </h3>
              <p className="mb-6 sm:mb-8 text-sm sm:text-base text-gray-300">
                I&apos;m always open to new opportunities and collaborations.
                Feel free to reach out!
              </p>
              <div className="space-y-4 sm:space-y-6">
                <motion.div
                  className="flex items-center"
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail className="mr-3 sm:mr-4 h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                  <span className="text-sm sm:text-base">
                    dinitothompson@gmail.com
                  </span>
                </motion.div>
                <motion.div
                  className="flex items-center"
                  whileTap={{ scale: 0.95 }}
                >
                  <Phone className="mr-3 sm:mr-4 h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                  <span className="text-sm sm:text-base">876-357-1273</span>
                </motion.div>
                <motion.div
                  className="flex items-center"
                  whileTap={{ scale: 0.95 }}
                >
                  <FileText className="mr-3 sm:mr-4 h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                  <Link
                    href="https://drive.google.com/drive/folders/1gewsLO8TAwmCM2ugSrGCNH1zWaQfGVBl?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-transparent hover:bg-blue-700 text-blue-400 hover:text-white border border-blue-500 hover:border-transparent rounded text-sm sm:text-base py-1 px-2 sm:py-2 sm:px-4 transition-all duration-300">
                      Download Resume
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
            <form
              onSubmit={handleSubmit}
              className="w-full lg:w-3/5 p-6 sm:p-8 lg:p-12 space-y-4 sm:space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <label
                    htmlFor="name"
                    className="block text-xs sm:text-sm font-medium text-gray-300 mb-1"
                  >
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your Name"
                    className="bg-gray-700/50 border-gray-600 focus:border-blue-500 text-white placeholder-gray-400 text-sm sm:text-base"
                    required
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.name}
                    </p>
                  )}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <label
                    htmlFor="email"
                    className="block text-xs sm:text-sm font-medium text-gray-300 mb-1"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Your Email"
                    className="bg-gray-700/50 border-gray-600 focus:border-blue-500 text-white placeholder-gray-400 text-sm sm:text-base"
                    required
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <label
                  htmlFor="message"
                  className="block text-xs sm:text-sm font-medium text-gray-300 mb-1"
                >
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your Message"
                  className="bg-gray-700/50 border-gray-600 focus:border-blue-500 text-white placeholder-gray-400 min-h-[120px] sm:min-h-[150px] text-sm sm:text-base"
                  required
                />
                {formErrors.message && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.message}
                  </p>
                )}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-sm sm:text-base py-2 sm:py-3"
                  disabled={isSubmitting || !canSendEmail}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : !canSendEmail ? (
                    `Wait ${countdown}s`
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
