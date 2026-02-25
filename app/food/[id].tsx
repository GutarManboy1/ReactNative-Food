import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useAppwrite from "@/lib/useAppwrite";
import { getMenuCustomizations, getMenuItemById } from "@/lib/appwrite";
import { useCartStore } from "@/store/cart.store";
import { CartCustomization, MenuItem } from "@/type";

export default function FoodDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { addItem } = useCartStore();
  const [selected, setSelected] = useState<CartCustomization[]>([]);

  const { data, loading } = useAppwrite({
    fn: getMenuItemById,
    params: { id: id as string },
  });

  const { data: customizationsData } = useAppwrite({
    fn: getMenuCustomizations,
    params: { menuId: id as string },
  });

  const item = data as MenuItem | null;
  const customizations = (customizationsData as unknown as CartCustomization[]) ?? [];

  // Group customizations by type
  const grouped = customizations.reduce<Record<string, CartCustomization[]>>(
    (acc, c) => {
      const key = c.type ?? "Other";
      if (!acc[key]) acc[key] = [];
      acc[key].push(c);
      return acc;
    },
    {}
  );

  const toggleCustomization = (cust: CartCustomization) => {
    setSelected((prev) => {
      const exists = prev.find((c) => c.id === cust.id);
      return exists ? prev.filter((c) => c.id !== cust.id) : [...prev, cust];
    });
  };

  const isSelected = (cust: CartCustomization) =>
    selected.some((c) => c.id === cust.id);

  const extraCost = selected.reduce((sum, c) => sum + c.price, 0);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#FE8C00" />
      </View>
    );
  }

  if (!item) return null;

  return (
    <View className="flex-1 bg-white">
      {/* Orange header with food image */}
      <View
        className="bg-primary items-center pb-10"
        style={{ paddingTop: insets.top + 12 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="self-start ml-5 mb-6 flex-row items-center bg-white/20 px-4 py-2 rounded-full"
        >
          <Text className="paragraph-bold text-white">← Back to Search</Text>
        </TouchableOpacity>
        <Image
          source={{ uri: item.image_url }}
          style={{ width: 220, height: 220 }}
          resizeMode="contain"
        />
      </View>

      {/* White content area overlapping the header */}
      <ScrollView
        className="flex-1 bg-white"
        style={{ borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -24 }}
        contentContainerStyle={{ padding: 24, paddingBottom: insets.bottom + 32 }}
      >
        {/* Name and type badge */}
        <View className="flex-row items-start justify-between mb-3">
          <Text className="h3-bold text-dark-100 flex-1 mr-3" numberOfLines={2}>
            {item.name}
          </Text>
          <View className="bg-primary/10 px-3 py-1 rounded-full mt-1">
            <Text className="body-medium text-primary">{item.type}</Text>
          </View>
        </View>

        {/* Rating */}
        <View className="flex-row items-center mb-3">
          <Text className="text-yellow-400 text-lg mr-1">★</Text>
          <Text className="paragraph-semibold text-dark-100">{item.rating}</Text>
        </View>

        {/* Price */}
        <Text className="base-bold text-primary mb-5">From ¥{item.price}</Text>

        {/* Description */}
        <Text className="paragraph-medium text-gray-400 mb-8">{item.description}</Text>

        {/* Nutrition stats */}
        <View className="flex-row gap-3 mb-8">
          <View className="flex-1 bg-orange-50 rounded-2xl p-4 items-center">
            <Text className="text-2xl mb-1">🔥</Text>
            <Text className="base-bold text-dark-100">{item.calories}</Text>
            <Text className="body-regular text-gray-400">Calories</Text>
          </View>
          <View className="flex-1 bg-orange-50 rounded-2xl p-4 items-center">
            <Text className="text-2xl mb-1">💪</Text>
            <Text className="base-bold text-dark-100">{item.protein}g</Text>
            <Text className="body-regular text-gray-400">Protein</Text>
          </View>
        </View>

        {/* Customizations */}
        {Object.keys(grouped).length > 0 && (
          <View className="mb-8">
            <Text className="base-bold text-dark-100 mb-4">Customizations</Text>
            {Object.entries(grouped).map(([type, items]) => (
              <View key={type} className="mb-5">
                <Text className="paragraph-semibold text-gray-400 capitalize mb-3">
                  {type}s
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {items.map((cust) => {
                    const active = isSelected(cust);
                    return (
                      <TouchableOpacity
                        key={cust.id}
                        onPress={() => toggleCustomization(cust)}
                        className={`px-4 py-2 rounded-full border ${
                          active
                            ? "bg-primary border-primary"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <Text
                          className={`body-medium ${
                            active ? "text-white" : "text-dark-100"
                          }`}
                        >
                          {cust.name}
                        </Text>
                        <Text
                          className={`small-bold ${
                            active ? "text-white/80" : "text-primary"
                          }`}
                        >
                          +¥{cust.price}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Add to cart button */}
        <TouchableOpacity
          className="custom-btn"
          onPress={() => {
            addItem({
              id: item.$id,
              name: item.name,
              price: item.price,
              image_url: item.image_url,
              customizations: selected,
            });
            router.back();
          }}
        >
          <Text className="paragraph-bold text-white">
            Add to Cart — ¥{item.price + extraCost}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
