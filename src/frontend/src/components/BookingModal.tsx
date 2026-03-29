import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSubmitBooking } from "../hooks/useQueries";

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceType: string;
  serviceLabel: string;
}

export function BookingModal({
  open,
  onOpenChange,
  serviceType,
  serviceLabel,
}: BookingModalProps) {
  const { identity, login } = useInternetIdentity();
  const { mutateAsync, isPending } = useSubmitBooking();
  const [form, setForm] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) {
      toast.error("Please log in to book a session.");
      login();
      return;
    }
    try {
      await mutateAsync({
        name: form.name,
        email: form.email,
        serviceType,
        date: form.date,
        time: form.time,
        message: form.message,
      });
      toast.success(
        `🌸 Booking confirmed for ${serviceLabel}! We'll be in touch soon.`,
      );
      onOpenChange(false);
      setForm({ name: "", email: "", date: "", time: "", message: "" });
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg"
        style={{ background: "#FDF6E9", border: "1px solid #D4870A" }}
        data-ocid="booking.dialog"
      >
        <DialogHeader>
          <div className="flex justify-center mb-2">
            <svg
              aria-hidden="true"
              width="40"
              height="40"
              viewBox="0 0 60 60"
              fill="none"
            >
              <path
                d="M30 50 C30 50 18 38 18 28 C18 20 24 14 30 14 C36 14 42 20 42 28 C42 38 30 50 30 50Z"
                fill="#D4870A"
                opacity="0.5"
              />
              <circle cx="30" cy="28" r="4" fill="#D4870A" />
            </svg>
          </div>
          <DialogTitle
            className="font-cinzel text-center text-xl"
            style={{ color: "#6B1C1C" }}
          >
            Book Your {serviceLabel} Session
          </DialogTitle>
          <DialogDescription className="font-crimson text-center text-base">
            Fill in your details and we'll confirm your sacred appointment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="booking-name"
                className="font-cinzel text-xs tracking-widest"
                style={{ color: "#6B1C1C" }}
              >
                FULL NAME *
              </Label>
              <Input
                id="booking-name"
                required
                value={form.name}
                onChange={handleChange("name")}
                placeholder="Your full name"
                data-ocid="booking.input"
                style={{ borderColor: "#D4870A", background: "#FAF4E8" }}
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="booking-email"
                className="font-cinzel text-xs tracking-widest"
                style={{ color: "#6B1C1C" }}
              >
                EMAIL *
              </Label>
              <Input
                id="booking-email"
                type="email"
                required
                value={form.email}
                onChange={handleChange("email")}
                placeholder="your@email.com"
                style={{ borderColor: "#D4870A", background: "#FAF4E8" }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="booking-date"
                className="font-cinzel text-xs tracking-widest"
                style={{ color: "#6B1C1C" }}
              >
                PREFERRED DATE *
              </Label>
              <Input
                id="booking-date"
                type="date"
                required
                value={form.date}
                onChange={handleChange("date")}
                style={{ borderColor: "#D4870A", background: "#FAF4E8" }}
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="booking-time"
                className="font-cinzel text-xs tracking-widest"
                style={{ color: "#6B1C1C" }}
              >
                PREFERRED TIME *
              </Label>
              <Input
                id="booking-time"
                type="time"
                required
                value={form.time}
                onChange={handleChange("time")}
                style={{ borderColor: "#D4870A", background: "#FAF4E8" }}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="booking-message"
              className="font-cinzel text-xs tracking-widest"
              style={{ color: "#6B1C1C" }}
            >
              MESSAGE
            </Label>
            <Textarea
              id="booking-message"
              value={form.message}
              onChange={handleChange("message")}
              placeholder="Share anything you'd like us to know before your session..."
              rows={3}
              data-ocid="booking.textarea"
              style={{ borderColor: "#D4870A", background: "#FAF4E8" }}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 font-cinzel text-xs tracking-widest"
              onClick={() => onOpenChange(false)}
              data-ocid="booking.cancel_button"
              style={{ borderColor: "#D4870A", color: "#6B1C1C" }}
            >
              CANCEL
            </Button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 btn-gold py-2 px-6 font-cinzel text-xs tracking-widest flex items-center justify-center gap-2"
              data-ocid="booking.submit_button"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isPending ? "BOOKING..." : "CONFIRM BOOKING"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
