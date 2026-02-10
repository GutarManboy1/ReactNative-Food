import { Text, View, SafeAreaView, FlatList } from "react-native";
import React, { use, useEffect } from "react";
import clsx from "clsx";
import useAppwrite from "@/lib/useAppwrite";
import { getCategories, getMenu } from "@/lib/appwrite";
import { useLocalSearchParams } from "expo-router";
import CartButton from "@/components/CartButton";
import MenuCard from "@/components/MenuCard";
import { MenuItem } from "@/type";


const search = () => {
  const { category, query } = useLocalSearchParams<{
    category?: string;
    query?: string;
  }>();
  console.log("Search params:", { category, query });

  const { data, refetch, loading } = useAppwrite({
    fn: getMenu,
    params: {
      category: category || "",
      query: query || "",
      limit: 6,
    },
  });

  const { data: categories } = useAppwrite({
    fn: getCategories,
  });

  console.log("Search data:", data);

  useEffect(() => {
    refetch({
      category: category || "",
      query: query || "",
      limit: 6,
    });
  }, [category, query]);

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={data}
        renderItem={({ item, index }) => {
          const isFirstRightColItem = index % 2 === 0;
          return (
            <View className={clsx("flex-1 max-w-[48%]", !isFirstRightColItem ? "mt-10" : "mt-0")}>
              <MenuCard item={item as MenuItem} />
            </View>
          );
        }}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        columnWrapperClassName="gap-7"
        contentContainerClassName="gap-7 px-5 pb-32"
        ListHeaderComponent={() => (
          <View className="my-5 gap-5">
            <View className="flex-between flex-row w-full">
              <View className="flex-start">
                <Text className="small-bold uppercase text-primary">
                  Search
                </Text>
                <View className="flex-start flex-row gap-x-1 mt-0.5">
                  <Text className="paragraph-semibold text-dark-100">
                    Pick your Poison, Fattie
                  </Text>
                </View>
              </View>
              <CartButton />
            </View>
            <Text>Search Input</Text>
            <Text>Filter</Text>
          </View>
        )}
        ListEmptyComponent={()=> !loading && <Text>No results found</Text>}
      />
    </SafeAreaView>
  );
};

export default search;
