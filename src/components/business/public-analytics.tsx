"use client";

import { useEffect, useRef, type ReactNode } from "react";

import {
  recordPublicEvent,
  type PublicEventType,
} from "@/lib/analytics/public-events";

type EventReference = {
  businessId: string;
  eventType: PublicEventType;
  productId?: string;
  promotionId?: string;
};

export function BusinessProfileView({ businessId }: { businessId: string }) {
  useEffect(() => {
    void recordPublicEvent({ businessId, eventType: "profile_view" });
  }, [businessId]);

  return null;
}

export function TrackedExternalLink({
  children,
  className,
  href,
  label,
  event,
}: {
  children: ReactNode;
  className?: string;
  href: string;
  label: string;
  event: EventReference;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow noopener noreferrer"
      aria-label={label}
      className={className}
      onClick={() => void recordPublicEvent(event)}
    >
      {children}
    </a>
  );
}

export function ViewedItem({
  children,
  event,
}: {
  children: ReactNode;
  event: EventReference;
}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const recorded = useRef(false);
  const { businessId, eventType, productId, promotionId } = event;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || recorded.current) return;
        recorded.current = true;
        void recordPublicEvent({
          businessId,
          eventType,
          productId,
          promotionId,
        });
        observer.disconnect();
      },
      { threshold: 0.6 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [businessId, eventType, productId, promotionId]);

  return <div ref={elementRef}>{children}</div>;
}
