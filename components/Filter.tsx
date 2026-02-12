import { Text, FlatList, TouchableOpacity, Platform } from "react-native";
import React, { useState } from "react";
import { Category } from "@/type";
import { useLocalSearchParams, router } from "expo-router";
import clsx from "clsx";

const Filter = ({ categories }: { categories: Category[] }) => {
  const searchParams = useLocalSearchParams();
  const [active, setActive] = useState(searchParams.category || "");

  const handlePress = (categoryId: string) => {
    setActive(categoryId);
    if (categoryId === "") router.setParams({ category: "" });
    else {
      router.setParams({ category: categoryId });
    }
  };

  const filterData: (Category | { $id: string; name: string })[] = categories
    ? [{ $id: "", name: "All" }, ...categories]
    : [{ $id: "", name: "All" }];

  return (
    <FlatList
      data={filterData}
      keyExtractor={(item) => item.$id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-x-2 pb-3"
      renderItem={({ item }) => (
        <TouchableOpacity
          key={item.$id}
          className={clsx("filter", active === item.$id ? "bg-amber-500" : "")}
          style={
            Platform.OS === "android"
              ? { shadowColor: "#878787", elevation: 10 }
              : {}
          }
          onPress={() => handlePress(item.$id)}
        >
          <Text
            className={clsx(
              "body-medium",
              active === item.$id ? "text-white" : "text-gray-200",
            )}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
};

export default Filter;
