import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useIAP,
  getAvailablePurchases as fetchAvailablePurchases,
} from 'expo-iap';

export const PRODUCT_ID = 'unlock_all_calculators';
const CACHE_KEY = 'jobsitecalc.premium';

interface EntitlementValue {
  isPremium: boolean;
  /** Localized price string, e.g. "$7.99" — null until the store responds. */
  price: string | null;
  purchasing: boolean;
  purchase: () => Promise<void>;
  /** Returns true if a prior purchase was found. */
  restore: () => Promise<boolean>;
}

const EntitlementContext = createContext<EntitlementValue | null>(null);

export function EntitlementProvider({ children }: { children: React.ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  const { connected, products, fetchProducts, requestPurchase, finishTransaction } = useIAP({
    onPurchaseSuccess: async (purchase) => {
      // No backend by design: StoreKit 2 transactions are locally verified,
      // acceptable for an offline one-time unlock.
      await finishTransaction({ purchase, isConsumable: false });
      await grantPremium();
      setPurchasing(false);
    },
    onPurchaseError: (error) => {
      setPurchasing(false);
      const code = String(error?.code ?? '');
      const cancelled = code.toLowerCase().includes('cancel');
      if (!cancelled) {
        Alert.alert(
          'Purchase failed',
          error?.message ?? 'The App Store could not complete the purchase. Try again later.',
        );
      }
    },
  });

  const grantPremium = async () => {
    setIsPremium(true);
    await AsyncStorage.setItem(CACHE_KEY, 'true');
  };

  // Cached entitlement first so the app never flashes locked state offline.
  useEffect(() => {
    AsyncStorage.getItem(CACHE_KEY).then((v) => {
      if (v === 'true') setIsPremium(true);
    });
  }, []);

  // Once the store connects: load the product and reconcile with real purchases.
  useEffect(() => {
    if (!connected) return;
    fetchProducts({ skus: [PRODUCT_ID], type: 'in-app' });
    fetchAvailablePurchases()
      .then((purchases) => {
        if (purchases.some((p) => p.productId === PRODUCT_ID)) {
          grantPremium();
        }
      })
      .catch(() => {
        // Offline or store unavailable — keep cached state.
      });
  }, [connected]);

  const purchase = useCallback(async () => {
    if (purchasing) return;
    setPurchasing(true);
    try {
      await requestPurchase({
        request: { apple: { sku: PRODUCT_ID }, google: { skus: [PRODUCT_ID] } },
        type: 'in-app',
      });
      // Result arrives via onPurchaseSuccess/onPurchaseError.
    } catch {
      setPurchasing(false);
    }
  }, [purchasing, requestPurchase]);

  const restore = useCallback(async (): Promise<boolean> => {
    const purchases = await fetchAvailablePurchases();
    const owned = purchases.some((p) => p.productId === PRODUCT_ID);
    if (owned) await grantPremium();
    return owned;
  }, []);

  const price = useMemo(() => {
    const product = products.find((p) => p.id === PRODUCT_ID);
    return product?.displayPrice ?? null;
  }, [products]);

  const value = useMemo(
    () => ({ isPremium, price, purchasing, purchase, restore }),
    [isPremium, price, purchasing, purchase, restore],
  );

  return <EntitlementContext.Provider value={value}>{children}</EntitlementContext.Provider>;
}

export function useEntitlement(): EntitlementValue {
  const ctx = useContext(EntitlementContext);
  if (!ctx) throw new Error('useEntitlement must be used within EntitlementProvider');
  return ctx;
}
