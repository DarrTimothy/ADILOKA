"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { CheckCircle2, XCircle, AlertCircle, LogOut } from "lucide-react";

type NotifType = "success" | "error" | "info" | "logout";

type Notif = {
  id: string;
  message: string;
  type: NotifType;
};

type NotifContextType = {
  showNotif: (message: string, type: NotifType) => void;
};

const NotifContext = createContext<NotifContextType | undefined>(undefined);

const NOTIF_DURATION = 2000;

export function NotifProvider({ children }: { children: React.ReactNode }) {
  const [notif, setNotif] = useState<Notif[]>([]);

  const showNotif = useCallback((message: string, type: NotifType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotif((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeNotif = useCallback((id: string) => {
    setNotif((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <NotifContext.Provider value={{ showNotif }}>
      {children}
      <div className="fixed top-10 right-5 z-9999 flex flex-col gap-4 max-w-sm w-full pointer-events-none p-2">
        {notif.map((item) => (
          <ToastItem key={item.id} item={item} onClose={removeNotif} />
        ))}
      </div>
    </NotifContext.Provider>
  );
}

function ToastItem({
  item,
  onClose,
}: {
  item: Notif;
  onClose: (id: string) => void;
}) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onClose(item.id);
    }, NOTIF_DURATION);

    return () => clearTimeout(timeout);
  }, [item.id, onClose]);

  let icon = <AlertCircle className="w-5 h-5 text-blue-500 shrink-0" />;
  let barColor = "bg-blue-500";

  if (item.type === "success") {
    icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
    barColor = "bg-emerald-500";
  } else if (item.type === "error") {
    icon = <XCircle className="w-5 h-5 text-red-500 shrink-0" />;
    barColor = "bg-red-600";
  } else if (item.type === "logout") {
    icon = <LogOut className="w-5 h-5 text-red-500 shrink-0" />;
    barColor = "bg-red-500";
  }

  return (
    <div
      className="pointer-events-auto relative flex items-center gap-3 px-4 py-4 rounded-xl border border-gray-100 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] 
    overflow-hidden transition-all duration-300 animate-slide-in">
      {icon}
      <p className="text-sm font-medium text-gray-800 tracking-wide leading-relaxed pr-2">
        {item.message}
      </p>
      <div className="absolute bottom-0 left-0 h-0.75 bg-gray-100 w-full">
        <div
          className={`h-full ${barColor} right-0 absolute`} 
          style={{
            animation: `shrinkWidth ${NOTIF_DURATION}ms linear forwards`,
          }}
        />
      </div>
    </div>
  );
}

export function useNotif() {
  const context = useContext(NotifContext);
  if (!context) {
    throw new Error("useNotif harus digunakan di dalam komponen NotifProvider");
  }
  return context;
}
