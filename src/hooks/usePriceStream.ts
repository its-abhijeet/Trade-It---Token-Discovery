import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/hooks/useReduxHooks";
import { pushDelta, setConnected } from "@/features/websocket/websocketSlice";
import { updatePrice } from "@/features/table/tableSlice";

// Simple mock emitter — in prod you'd connect to real WS.
export function usePriceStream(enabled = true) {
  const dispatch = useAppDispatch();
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    runningRef.current = true;
    dispatch(setConnected(true));

    // generator that emits a random update every 300-800ms per call
    const emit = () => {
      if (!runningRef.current) return;
      const pairs = ["ABC/USDT", "DEF/USDT", "GHI/USDT"];
      const pair = pairs[Math.floor(Math.random() * pairs.length)];
      const price = Number((Math.random() * 20).toFixed(6));
      const ts = Date.now();

      dispatch(pushDelta({ pair, price, ts }));
      dispatch(updatePrice({ pair, price, ts }));

      const delay = 300 + Math.random() * 500;
      // schedule next
      rafRef.current = window.setTimeout(emit, delay) as unknown as number;
    };

    emit();

    return () => {
      runningRef.current = false;
      if (rafRef.current) window.clearTimeout(rafRef.current);
      dispatch(setConnected(false));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, dispatch]);
}
