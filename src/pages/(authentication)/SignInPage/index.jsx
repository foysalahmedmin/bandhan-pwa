import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import { Radio } from "@/components/ui/Radio";
import URLS from "@/constants/urls";
import useAuthenticationState from "@/hooks/state/useAuthenticationState";
import useLanguageState from "@/hooks/state/useLanguageState";
import { useSheikhSigninUserMutation } from "@/redux/services/sheikhApi";
import { useSigninUserMutation } from "@/redux/services/zenithApi";
import authStorage from "@/utils/authStorage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SignInPage = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [deviceName, setDeviceName] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [selectedLoginType, setSelectedLoginType] = useState("bandhan");

  const { setLoginPanel } = useAuthenticationState();

  const [signinUser] = useSigninUserMutation();
  const [sheikhSigninUser] = useSheikhSigninUserMutation();

  const { isEnglish } = useLanguageState();
  const navigate = useNavigate();

  const types = [
    {
      value: "bandhan",
      labels: {
        en: "Bandhan",
        bn: "বন্ধন",
      },
    },
    {
      value: "zenith",
      labels: {
        en: "Zenith",
        bn: "জেনিথ",
      },
    },
    {
      value: "sheikh",
      labels: {
        en: "Sheikh",
        bn: "শেখ",
      },
    },
  ];

  useEffect(() => {
    const getDeviceInfo = () => {
      const userAgent = navigator.userAgent;

      let brand = "Unknown";
      let deviceName = "Unknown Device";

      // Detect OS and device type
      if (/Android/i.test(userAgent)) {
        brand = "Android";
        deviceName = "Android Device";
      } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
        brand = "Apple";
        deviceName = "Apple Device";
      } else if (/Windows NT/i.test(userAgent)) {
        brand = "Windows";
        deviceName = "Windows Device";
      } else if (/Macintosh/i.test(userAgent)) {
        brand = "Apple";
        deviceName = "Mac Device";
      } else {
        deviceName = "Unknown Device";
      }

      console.log(userAgent, brand, deviceName);

      setDeviceName(brand + "_" + deviceName);
    };

    getDeviceInfo();
  }, []);

  const handleLogin = async () => {
    if (!mobileNumber || !password) {
      alert(isEnglish ? "Please fill in all fields" : "সব তথ্য পূরণ করুন");
      return;
    }
    setIsLoading(true);

    try {
      if (selectedLoginType === "bandhan") {
        const settings = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: mobileNumber,
            password: password,
            version: "3.0.1",
            model: deviceName,
          }),
        };

        const response = await fetch(URLS.baseURL + "/app/login", settings);
        const data = await response.json();

        if (data?.code === 200) {
          authStorage.storeAuthToken(data.payload.auth_token);
          setLoginPanel("bandhan");
          navigate("/", { replace: true });
        } else {
          alert(data?.message || "Login failed");
        }
      } else if (selectedLoginType === "zenith") {
        const { data } = await signinUser({
          phone: mobileNumber,
          password: password,
        });
        if (data?.message === "No User Found") {
          alert(data?.message);
          setIsLoading(false);
        } else {
          authStorage.storeAuthToken(data[0]._id);

          setIsLoading(false);
          setLoginPanel("zenith");
          navigate("/", { replace: true });
        }
      } else if (selectedLoginType === "sheikh") {
        const { data } = await sheikhSigninUser({
          phone: mobileNumber,
          password: password,
        });

        if (data?.message === "No User Found") {
          alert(data?.message);
          setIsLoading(false);
        } else {
          authStorage.storeAuthToken(data[0]._id);
          setIsLoading(false);
          setLoginPanel("sheikh");
          navigate("/", { replace: true });
        }
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Error logging in, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <section>
        <div className="gird container h-screen place-content-center text-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <img className="h-40 object-contain" src="/logo.png" alt="logo" />
            </div>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-center gap-4">
                {types.map(({ value, labels }, index) => (
                  <label key={index} className="flex items-center gap-2">
                    <Radio
                      type="radio"
                      name="loginType"
                      value={value}
                      checked={selectedLoginType === value}
                      onChange={() => setSelectedLoginType(value)}
                    />
                    <span>{labels[isEnglish ? "en" : "bn"]}</span>
                  </label>
                ))}
              </div>
              <FormControl
                className="rounded-full"
                type="tel"
                placeholder={
                  isEnglish ? "Enter Mobile Number" : "মোবাইল নম্বর লিখুন"
                }
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
              <FormControl
                className="rounded-full"
                type="password"
                placeholder={isEnglish ? "Password" : "পাসওয়ার্ড"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div>
                <Button
                  className="w-full"
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : isEnglish ? "Login" : "লগইন"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SignInPage;
