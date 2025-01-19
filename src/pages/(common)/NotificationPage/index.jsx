import { useNotifications } from "@/components/providers/NotificationsProvider";
import useLanguageState from "@/hooks/state/useLanguageState";
import { cn } from "@/lib/utils";

const NotificationCard = ({ item, ...props }) => {
  return (
    <div
      className={cn(
        `flex w-full cursor-pointer items-start rounded-md border bg-card p-4 shadow-sm transition hover:shadow`,
        {
          "bg-muted": item?.viewed,
        },
      )}
      {...props}
    >
      <div className="flex-1">
        <h2 className="text-lg font-semibold">{item?.title}</h2>
        <p className="text-sm">{item?.description}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {new Date(item.date).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

const NotificationsPage = () => {
  const { isEnglish } = useLanguageState();
  const { notifications, handleNotification } = useNotifications();

  return (
    <main>
      <section>
        <div className="container space-y-4">
          {notifications.length > 0 ? (
            <>
              <div className="space-y-2">
                <span className="block font-semibold text-primary">
                  {isEnglish ? "Push Notifications" : "পুশ নোটিফিকেশনস"}
                </span>
              </div>
              <div className="space-y-2">
                {notifications?.map((item, index) => (
                  <NotificationCard
                    key={item.date}
                    item={index}
                    onClick={() => handleNotification(item)}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              <span>No Notifications Found</span>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default NotificationsPage;
