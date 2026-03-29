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
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

interface ProfileSetupModalProps {
  open: boolean;
}

export function ProfileSetupModal({ open }: ProfileSetupModalProps) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    setSaving(true);
    try {
      await actor.saveCallerUserProfile({ name, email });
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
      toast.success("Welcome to Soulful Mind! 🌸");
    } catch {
      toast.error("Could not save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        style={{ background: "#FDF6E9", border: "1px solid #D4870A" }}
        data-ocid="profile.dialog"
      >
        <DialogHeader>
          <DialogTitle
            className="font-cinzel text-center text-xl"
            style={{ color: "#6B1C1C" }}
          >
            Welcome, Sacred Soul
          </DialogTitle>
          <DialogDescription className="font-crimson text-center text-base">
            Please share your name to personalise your journey with us.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label
              className="font-cinzel text-xs tracking-widest"
              style={{ color: "#6B1C1C" }}
            >
              YOUR NAME *
            </Label>
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              data-ocid="profile.input"
              style={{ borderColor: "#D4870A", background: "#FAF4E8" }}
            />
          </div>
          <div className="space-y-1.5">
            <Label
              className="font-cinzel text-xs tracking-widest"
              style={{ color: "#6B1C1C" }}
            >
              EMAIL
            </Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{ borderColor: "#D4870A", background: "#FAF4E8" }}
            />
          </div>
          <button
            type="submit"
            disabled={saving || !name}
            className="w-full btn-gold py-2.5 font-cinzel text-xs tracking-widest flex items-center justify-center gap-2"
            data-ocid="profile.submit_button"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            BEGIN MY JOURNEY
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
