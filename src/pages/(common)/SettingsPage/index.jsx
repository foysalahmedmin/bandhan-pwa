import { FormControl } from "@/components/ui/FormControl";
import { Radio } from "@/components/ui/Radio";
import useLanguageState from "@/hooks/state/useLanguageState";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

const SettingsPage = () => {
  const { language, isEnglish, setLanguage } = useLanguageState();
  const [isOpen, setIsOpen] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <main>
      <section className="py-4">
        <div className="container space-y-4">
          <div className="dark space-y-2 rounded-md bg-primary p-4 text-primary-foreground">
            <span className="block font-semibold">
              {isEnglish ? "Select Language" : "ভাষা নির্বাচন"}
            </span>
            <div className="flex items-center gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <Radio
                  className="primary-foreground text-xl"
                  value="en"
                  checked={language === "en"}
                  onChange={() => setLanguage("en")}
                  name="language"
                />
                <span>English</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <Radio
                  className="primary-foreground text-xl"
                  value="bn"
                  checked={language === "bn"}
                  onChange={() => setLanguage("bn")}
                  name="language"
                />
                <span>বাংলা</span>
              </label>
            </div>
          </div>
          <div className="dark space-y-2 rounded-md bg-primary p-4 text-primary-foreground">
            <div>
              <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between gap-2"
              >
                <span className="block font-semibold">
                  {isEnglish ? "Change Password" : "পাসওয়ার্ড পরিবর্তন করুন"}
                </span>
                <div className="flex aspect-square shrink-0 items-center justify-center rounded-full bg-primary-foreground p-[0.125rem] text-primary">
                  {isOpen ? (
                    <Minus strokeWidth={3} className="size-4" />
                  ) : (
                    <Plus strokeWidth={3} className="size-4" />
                  )}
                </div>
              </div>
              <div className={cn("accordion", { open: isOpen })}>
                <div className="accordion-content">
                  <div className="py-4">
                    <form className="space-y-4">
                      <label className="block space-y-2">
                        <span className="text-sm">
                          {isEnglish ? "Old Password" : "পুরানো পাসওয়ার্ড"}
                        </span>
                        <FormControl
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="w-full"
                          type="password"
                          name="oldPassword"
                          placeholder={
                            isEnglish ? "Old Password" : "পুরানো পাসওয়ার্ড"
                          }
                        />
                      </label>
                      <label className="block space-y-2">
                        <span className="text-sm">
                          {isEnglish ? "New Password" : "নতুন পাসওয়ার্ড"}
                        </span>
                        <FormControl
                          onChange={(e) => setNewPassword(e.target.value)}
                          type="password"
                          name="newPassword"
                          placeholder={
                            isEnglish ? "New Password" : "নতুন পাসওয়ার্ড"
                          }
                        />
                      </label>
                      <label className="block space-y-2">
                        <span className="text-sm">
                          {isEnglish
                            ? "Confirm Password"
                            : "নিশ্চিত পাসওয়ার্ড"}
                        </span>
                        <FormControl
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          type="password"
                          name="confirmPassword"
                          placeholder={
                            isEnglish
                              ? "Confirm Password"
                              : "নিশ্চিত পাসওয়ার্ড"
                          }
                        />
                      </label>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SettingsPage;
