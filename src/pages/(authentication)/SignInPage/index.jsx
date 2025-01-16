import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import { Radio } from "@/components/ui/Radio";
import URLS from "@/constants/urls";
import useAuthenticationState from "@/hooks/state/useAuthenticationState";
import useLanguageState from "@/hooks/state/useLanguageState";
import {
  useSheikhSigninUserMutation,
  useZenithSigninUserMutation,
} from "@/redux/services/tmsApi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SignInPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [deviceName, setDeviceName] = useState("");

  const [userType, setUserType] = useState("bandhan");

  const { isLoading, setIsLoading, setUser, setLoginPanel } =
    useAuthenticationState();

  const [signinZenithUser] = useZenithSigninUserMutation();
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

      setDeviceName(brand + "_" + deviceName);
    };

    getDeviceInfo();
  }, []);

  const handleLogin = async () => {
    if (!phone || !password) {
      alert(isEnglish ? "Please fill in all fields" : "সব তথ্য পূরণ করুন");
      return;
    }

    setIsLoading(true);

    try {
      switch (userType) {
        case "bandhan":
          await handleBandhanLogin();
          break;
        case "zenith":
          await handleZenithLogin();
          break;
        case "sheikh":
          await handleSheikhLogin();
          break;
        default:
          alert("Invalid login type");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Error logging in, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBandhanLogin = async () => {
    const settings = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: phone,
        password: password,
        version: "3.0.1",
        model: deviceName,
      }),
    };

    const response = await fetch(URLS.baseURL + "/app/login", settings);
    const data = await response?.json();

    if (data?.code === 200) {
      const token = data?.payload?.auth_token;
      setUser(token);
      setLoginPanel("bandhan");
      navigate("/", { replace: true });
    } else {
      setUser(null);
      alert(data?.message || "Login failed");
    }
  };

  const handleZenithLogin = async () => {
    const { data } = await signinZenithUser({
      phone: phone,
      password: password,
    });

    if (data?.message === "No User Found") {
      alert(data?.message);
      setIsLoading(false);
    } else {
      setUser(data?.[0]?._id);
      setLoginPanel("zenith");
      navigate("/", { replace: true });
    }
  };

  const handleSheikhLogin = async () => {
    const { data } = await sheikhSigninUser({
      phone: phone,
      password: password,
    });

    if (data?.message === "No User Found") {
      alert(data?.message);
      setIsLoading(false);
    } else {
      setUser(data?.[0]?._id);
      setLoginPanel("sheikh");
      navigate("/", { replace: true });
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
                      checked={userType === value}
                      onChange={() => setUserType(value)}
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
                  isLoading={isLoading}
                >
                  {isEnglish ? "Login" : "লগইন"}
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
