import React from 'react';
import { Bell, Loader2, MailOpen } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useNotifications } from '@/hooks/useNotifications';

export function NotificationMenu() {
  const { notifications, unreadCount, loading, markRead } = useNotifications();
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button variant="ghost" size="icon" className="relative" onClick={() => setOpen(true)}>
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">You’re all caught up.</p>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className="p-3 rounded-lg border border-border flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground mb-1">{notification.message}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!notification.read ? (
                    <Button size="sm" variant="ghost" onClick={() => markRead(notification.id)}>
                      Mark read
                    </Button>
                  ) : (
                    <MailOpen className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
